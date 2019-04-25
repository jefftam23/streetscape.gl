function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable camelcase */
import assert from 'assert';
import { getXVIZConfig } from '@xviz/parser';
import XVIZWebsocketLoader from './xviz-websocket-loader';
import * as rangeUtils from '../utils/buffer-range';
const DEFAULT_LOG_PROFILE = 'default';
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_BUFFER_LENGTH = {
  seconds: 30,
  milliseconds: 30000
};

function getSocketRequestParams(options) {
  const logGuid = options.logGuid,
        _options$logProfile = options.logProfile,
        logProfile = _options$logProfile === void 0 ? DEFAULT_LOG_PROFILE : _options$logProfile,
        timestamp = options.timestamp,
        serverConfig = options.serverConfig,
        _options$bufferLength = options.bufferLength,
        bufferLength = _options$bufferLength === void 0 ? DEFAULT_BUFFER_LENGTH[getXVIZConfig().TIMESTAMP_FORMAT] : _options$bufferLength; // set duration overrides & defaults

  const duration = options.duration || serverConfig.defaultLogLength;
  assert(logGuid && duration);

  const queryParams = _objectSpread({}, serverConfig.queryParams, {
    log: logGuid,
    profile: logProfile
  });

  const retryAttempts = Number.isInteger(serverConfig.retryAttempts) ? serverConfig.retryAttempts : DEFAULT_RETRY_ATTEMPTS;
  const qs = Object.keys(queryParams).map(key => "".concat(key, "=").concat(queryParams[key])).join('&');
  return {
    url: "".concat(serverConfig.serverUrl, "?").concat(qs),
    logGuid,
    logProfile,
    duration,
    timestamp,
    bufferLength,
    retryAttempts,
    serverConfig
  };
} // Determine timestamp & duration to reconnect after an interrupted connection.
// Calculate based on current XVIZStreamBuffer data
// Returns null if update is not needed


export function updateSocketRequestParams(timestamp, metadata, bufferLength, bufferRange) {
  const _metadata$start_time = metadata.start_time,
        logStartTime = _metadata$start_time === void 0 ? -Infinity : _metadata$start_time,
        _metadata$end_time = metadata.end_time,
        logEndTime = _metadata$end_time === void 0 ? Infinity : _metadata$end_time;
  const totalDuration = logEndTime - logStartTime;
  const chunkSize = bufferLength || totalDuration;

  if (!Number.isFinite(totalDuration)) {
    // If there is no start/end time in metadata, buffer length must be supplied
    assert(bufferLength, 'bufferLength is invalid');
  }

  if (chunkSize >= totalDuration) {
    // Unlimited buffer
    return {
      startTimestamp: logStartTime,
      endTimestamp: logEndTime,
      bufferStart: logStartTime,
      bufferEnd: logEndTime
    };
  }

  const bufferStart = Math.max(timestamp - chunkSize / 2, logStartTime);
  const bufferEnd = Math.min(bufferStart + chunkSize, logEndTime);
  const newBufferRange = rangeUtils.subtract([bufferStart, bufferEnd], bufferRange);

  if (newBufferRange.length === 0) {
    return null;
  }

  const start = newBufferRange[0][0];
  const end = newBufferRange[newBufferRange.length - 1][1];
  return {
    startTimestamp: start,
    endTimestamp: end,
    bufferStart,
    bufferEnd
  };
}
export default class XVIZStreamLoader extends XVIZWebsocketLoader {
  /**
   * constructor
   * @params serverConfig {object}
   *   - serverConfig.serverUrl {string}
   *   - serverConfig.defaultLogLength {number, optional} - default 30
   *   - serverConfig.queryParams {object, optional}
   *   - serverConfig.retryAttempts {number, optional} - default 3
   * @params worker {string|function, optional}
   * @params maxConcurrency {number, optional} - default 3
   * @params logGuid {string}
   * @params logProfile {string, optional}
   * @params duration {number, optional}
   * @params timestamp {number, optional}
   * @params bufferLength {number, optional}
   */
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(options); // Construct websocket connection details from parameters

    _defineProperty(this, "_onOpen", () => {
      if (this.lastRequest) {
        this.xvizHandler.transformLog(this.lastRequest);
      }
    });

    this.requestParams = getSocketRequestParams(options);
    assert(this.requestParams.bufferLength, 'bufferLength must be provided');
    this.retrySettings = {
      retries: this.requestParams.retryAttempts,
      minTimeout: 500,
      randomize: true
    }; // Reconnection state

    this.lastRequest = null;
    this.bufferRange = rangeUtils.empty();
  }

  seek(timestamp) {
    super.seek(timestamp); // use clamped/rounded timestamp

    timestamp = this.getCurrentTime();

    if (this.lastRequest && this.streamBuffer.isInBufferRange(timestamp)) {
      // Already loading
      return;
    }

    const metadata = this.getMetadata();

    if (!metadata) {
      return;
    }

    const params = updateSocketRequestParams(timestamp, metadata, this.requestParams.bufferLength, this.bufferRange);

    if (!params) {
      return;
    }

    this.lastRequest = params; // prune buffer

    this.streamBuffer.updateFixedBuffer(params.bufferStart, params.bufferEnd);
    this.bufferRange = rangeUtils.intersect([params.bufferStart, params.bufferEnd], this.bufferRange);

    if (this.isOpen()) {
      this.xvizHandler.transformLog(params);
    } else {// Wait for socket to connect
    }
  }
  /* Hook overrides */


  _getBufferedTimeRanges() {
    return this.bufferRange;
  }

  _getBufferStartTime() {
    return this.lastRequest && this.lastRequest.bufferStart;
  }

  _getBufferEndTime() {
    return this.lastRequest && this.lastRequest.bufferEnd;
  }

  _onXVIZTimeslice(message) {
    const bufferUpdated = super._onXVIZTimeslice(message);

    if (bufferUpdated) {
      this.bufferRange = rangeUtils.add([this.lastRequest.startTimestamp, message.timestamp], this.bufferRange);
    }
  }

}
//# sourceMappingURL=xviz-stream-loader.js.map