function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
var DEFAULT_LOG_PROFILE = 'default';
var DEFAULT_RETRY_ATTEMPTS = 3;
var DEFAULT_BUFFER_LENGTH = {
  seconds: 30,
  milliseconds: 30000
};

function getSocketRequestParams(options) {
  var logGuid = options.logGuid,
      _options$logProfile = options.logProfile,
      logProfile = _options$logProfile === void 0 ? DEFAULT_LOG_PROFILE : _options$logProfile,
      timestamp = options.timestamp,
      serverConfig = options.serverConfig,
      _options$bufferLength = options.bufferLength,
      bufferLength = _options$bufferLength === void 0 ? DEFAULT_BUFFER_LENGTH[getXVIZConfig().TIMESTAMP_FORMAT] : _options$bufferLength; // set duration overrides & defaults

  var duration = options.duration || serverConfig.defaultLogLength;
  assert(logGuid && duration);

  var queryParams = _objectSpread({}, serverConfig.queryParams, {
    log: logGuid,
    profile: logProfile
  });

  var retryAttempts = Number.isInteger(serverConfig.retryAttempts) ? serverConfig.retryAttempts : DEFAULT_RETRY_ATTEMPTS;
  var qs = Object.keys(queryParams).map(function (key) {
    return "".concat(key, "=").concat(queryParams[key]);
  }).join('&');
  return {
    url: "".concat(serverConfig.serverUrl, "?").concat(qs),
    logGuid: logGuid,
    logProfile: logProfile,
    duration: duration,
    timestamp: timestamp,
    bufferLength: bufferLength,
    retryAttempts: retryAttempts,
    serverConfig: serverConfig
  };
} // Determine timestamp & duration to reconnect after an interrupted connection.
// Calculate based on current XVIZStreamBuffer data
// Returns null if update is not needed


export function updateSocketRequestParams(timestamp, metadata, bufferLength, bufferRange) {
  var _metadata$start_time = metadata.start_time,
      logStartTime = _metadata$start_time === void 0 ? -Infinity : _metadata$start_time,
      _metadata$end_time = metadata.end_time,
      logEndTime = _metadata$end_time === void 0 ? Infinity : _metadata$end_time;
  var totalDuration = logEndTime - logStartTime;
  var chunkSize = bufferLength || totalDuration;

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

  var bufferStart = Math.max(timestamp - chunkSize / 2, logStartTime);
  var bufferEnd = Math.min(bufferStart + chunkSize, logEndTime);
  var newBufferRange = rangeUtils.subtract([bufferStart, bufferEnd], bufferRange);

  if (newBufferRange.length === 0) {
    return null;
  }

  var start = newBufferRange[0][0];
  var end = newBufferRange[newBufferRange.length - 1][1];
  return {
    startTimestamp: start,
    endTimestamp: end,
    bufferStart: bufferStart,
    bufferEnd: bufferEnd
  };
}

var XVIZStreamLoader =
/*#__PURE__*/
function (_XVIZWebsocketLoader) {
  _inherits(XVIZStreamLoader, _XVIZWebsocketLoader);

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
  function XVIZStreamLoader() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, XVIZStreamLoader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XVIZStreamLoader).call(this, options)); // Construct websocket connection details from parameters

    _defineProperty(_assertThisInitialized(_this), "_onOpen", function () {
      if (_this.lastRequest) {
        _this.xvizHandler.transformLog(_this.lastRequest);
      }
    });

    _this.requestParams = getSocketRequestParams(options);
    assert(_this.requestParams.bufferLength, 'bufferLength must be provided');
    _this.retrySettings = {
      retries: _this.requestParams.retryAttempts,
      minTimeout: 500,
      randomize: true
    }; // Reconnection state

    _this.lastRequest = null;
    _this.bufferRange = rangeUtils.empty();
    return _this;
  }

  _createClass(XVIZStreamLoader, [{
    key: "seek",
    value: function seek(timestamp) {
      _get(_getPrototypeOf(XVIZStreamLoader.prototype), "seek", this).call(this, timestamp); // use clamped/rounded timestamp


      timestamp = this.getCurrentTime();

      if (this.lastRequest && this.streamBuffer.isInBufferRange(timestamp)) {
        // Already loading
        return;
      }

      var metadata = this.getMetadata();

      if (!metadata) {
        return;
      }

      var params = updateSocketRequestParams(timestamp, metadata, this.requestParams.bufferLength, this.bufferRange);

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

  }, {
    key: "_getBufferedTimeRanges",
    value: function _getBufferedTimeRanges() {
      return this.bufferRange;
    }
  }, {
    key: "_getBufferStartTime",
    value: function _getBufferStartTime() {
      return this.lastRequest && this.lastRequest.bufferStart;
    }
  }, {
    key: "_getBufferEndTime",
    value: function _getBufferEndTime() {
      return this.lastRequest && this.lastRequest.bufferEnd;
    }
  }, {
    key: "_onXVIZTimeslice",
    value: function _onXVIZTimeslice(message) {
      var bufferUpdated = _get(_getPrototypeOf(XVIZStreamLoader.prototype), "_onXVIZTimeslice", this).call(this, message);

      if (bufferUpdated) {
        this.bufferRange = rangeUtils.add([this.lastRequest.startTimestamp, message.timestamp], this.bufferRange);
      }
    }
  }]);

  return XVIZStreamLoader;
}(XVIZWebsocketLoader);

export { XVIZStreamLoader as default };
//# sourceMappingURL=xviz-stream-loader.js.map