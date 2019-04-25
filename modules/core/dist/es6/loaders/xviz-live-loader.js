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
import { XVIZStreamBuffer } from '@xviz/parser';
import XVIZWebsocketLoader from './xviz-websocket-loader';
const DEFAULT_LOG_PROFILE = 'default';
const DEFAULT_RETRY_ATTEMPTS = 3;

function getSocketRequestParams(options) {
  const _options$logProfile = options.logProfile,
        logProfile = _options$logProfile === void 0 ? DEFAULT_LOG_PROFILE : _options$logProfile,
        serverConfig = options.serverConfig,
        _options$bufferLength = options.bufferLength,
        bufferLength = _options$bufferLength === void 0 ? 30 : _options$bufferLength;

  const queryParams = _objectSpread({}, serverConfig.queryParams, {
    profile: logProfile
  });

  const retryAttempts = Number.isInteger(serverConfig.retryAttempts) ? serverConfig.retryAttempts : DEFAULT_RETRY_ATTEMPTS;
  const qs = Object.keys(queryParams).map(key => "".concat(key, "=").concat(queryParams[key])).join('&');
  return {
    url: "".concat(serverConfig.serverUrl, "?").concat(qs),
    logProfile,
    bufferLength,
    retryAttempts,
    serverConfig
  };
}
/*
 * Handle connecting to XVIZ socket and negotiation of the XVIZ protocol version
 *
 * This loader is used when connecting to a "live" XVIZ websocket.
 * This implies that the metadata does not have a start or end time
 * and that we want to display the latest message as soon as it arrives.
 */


export default class XVIZLiveLoader extends XVIZWebsocketLoader {
  /**
   * constructor
   * @params serverConfig {object}
   *   - serverConfig.serverUrl {string}
   *   - serverConfig.defaultLogLength {number, optional} - default 30
   *   - serverConfig.queryParams {object, optional}
   *   - serverConfig.retryAttempts {number, optional} - default 3
   * @params worker {string|function, optional}
   * @params maxConcurrency {number, optional} - default 3
   * @params logProfile {string, optional}
   * @params bufferLength {number, optional}
   */
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(options); // Construct websocket connection details from parameters

    _defineProperty(this, "_onOpen", () => {});

    this.requestParams = getSocketRequestParams(options);
    assert(this.requestParams.bufferLength, 'bufferLength must be provided');
    this.retrySettings = {
      retries: this.requestParams.retryAttempts,
      minTimeout: 500,
      randomize: true
    }; // Setup relative stream buffer storage by splitting bufferLength 1/3 : 2/3

    const bufferChunk = this.requestParams.bufferLength / 3; // Replace base class object

    this.streamBuffer = new XVIZStreamBuffer({
      startOffset: -2 * bufferChunk,
      endOffset: bufferChunk
    });
  }

  seek(timestamp) {
    super.seek(timestamp); // Info the streamBuffer so it can prune appropriately

    this.streamBuffer.setCurrentTime(timestamp);
  }
  /* Hook overrides */


  _getBufferStartTime() {
    return this.streamBuffer.getBufferRange().start;
  }

  _getBufferEndTime() {
    return this.streamBuffer.getBufferRange().end;
  }

  _onXVIZTimeslice(message) {
    super._onXVIZTimeslice(message); // Live loader always shows latest data


    this.seek(message.timestamp);
  }

}
//# sourceMappingURL=xviz-live-loader.js.map