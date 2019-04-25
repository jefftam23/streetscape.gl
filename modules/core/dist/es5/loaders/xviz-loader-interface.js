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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parser = require("@xviz/parser");

var _math = require("math.gl");

var _createSelector = _interopRequireDefault(require("../utils/create-selector"));

var _stats = _interopRequireDefault(require("../utils/stats"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable callback-return */
var XVIZLoaderInterface =
/*#__PURE__*/
function () {
  function XVIZLoaderInterface() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, XVIZLoaderInterface);

    _defineProperty(this, "onXVIZMessage", function (message) {
      switch (message.type) {
        case _parser.LOG_STREAM_MESSAGE.METADATA:
          _this._onXVIZMetadata(message);

          _this.emit('ready', message);

          break;

        case _parser.LOG_STREAM_MESSAGE.TIMESLICE:
          _this._onXVIZTimeslice(message);

          _this.emit('update', message);

          break;

        case _parser.LOG_STREAM_MESSAGE.DONE:
          _this.emit('finish', message);

          break;

        default:
          _this.emit('error', message);

      }
    });

    _defineProperty(this, "onError", function (error) {
      _this.emit('error', error);
    });

    _defineProperty(this, "getCurrentTime", function () {
      return _this.get('timestamp');
    });

    _defineProperty(this, "getLookAhead", function () {
      return _this.get('lookAhead');
    });

    _defineProperty(this, "getMetadata", function () {
      return _this.get('metadata');
    });

    _defineProperty(this, "getStreamSettings", function () {
      return _this.get('streamSettings');
    });

    _defineProperty(this, "_getDataVersion", function () {
      return _this.get('dataVersion');
    });

    _defineProperty(this, "_getStreams", (0, _createSelector.default)(this, this._getDataVersion, function () {
      return _this._getDataByStream();
    }));

    _defineProperty(this, "getBufferedTimeRanges", (0, _createSelector.default)(this, this._getDataVersion, function () {
      return _this._getBufferedTimeRanges();
    }));

    _defineProperty(this, "getStreams", (0, _createSelector.default)(this, [this.getStreamSettings, this._getStreams, this._getDataVersion], function (streamSettings, streams) {
      if (!streamSettings || !streams) {
        return streams;
      }

      var result = {};

      for (var streamName in streams) {
        if (streamSettings[streamName]) {
          result[streamName] = streams[streamName];
        }
      }

      return result;
    }));

    _defineProperty(this, "getBufferStartTime", (0, _createSelector.default)(this, this.getCurrentTime, function () {
      return _this._getBufferStartTime();
    }));

    _defineProperty(this, "getBufferEndTime", (0, _createSelector.default)(this, this.getCurrentTime, function () {
      return _this._getBufferEndTime();
    }));

    _defineProperty(this, "getLogStartTime", (0, _createSelector.default)(this, this.getMetadata, function (metadata) {
      return _this._getLogStartTime(metadata);
    }));

    _defineProperty(this, "getLogEndTime", (0, _createSelector.default)(this, this.getMetadata, function (metadata) {
      return _this._getLogEndTime(metadata);
    }));

    _defineProperty(this, "getCurrentFrame", (0, _createSelector.default)(this, [this.getStreamSettings, this.getCurrentTime, this.getLookAhead, this._getDataVersion], // `dataVersion` is only needed to trigger recomputation.
    // The logSynchronizer has access to the timeslices.
    function (streamSettings, timestamp, lookAhead) {
      var logSynchronizer = _this.logSynchronizer;

      if (logSynchronizer && Number.isFinite(timestamp)) {
        logSynchronizer.setTime(timestamp);
        logSynchronizer.setLookAheadTimeOffset(lookAhead);
        return logSynchronizer.getCurrentFrame(streamSettings);
      }

      return null;
    }));

    _defineProperty(this, "_update", function () {
      _this._updateTimer = null;

      _this.listeners.forEach(function (o) {
        return o(_this._version);
      });
    });

    this.options = options;

    this._debug = options.debug || function () {};

    this.callbacks = {};
    this.listeners = [];
    this.state = {};
    this._updates = 0;
    this._version = 0;
    this._updateTimer = null;
  }
  /* Event types:
   * - ready
   * - update
   * - finish
   * - error
   */


  _createClass(XVIZLoaderInterface, [{
    key: "on",
    value: function on(eventType, cb) {
      this.callbacks[eventType] = this.callbacks[eventType] || [];
      this.callbacks[eventType].push(cb);
      return this;
    }
  }, {
    key: "off",
    value: function off(eventType, cb) {
      var callbacks = this.callbacks[eventType];

      if (callbacks) {
        var index = callbacks.indexOf(cb);

        if (index >= 0) {
          callbacks.splice(index, 1);
        }
      }

      return this;
    }
  }, {
    key: "emit",
    value: function emit(eventType, eventArgs) {
      var callbacks = this.callbacks[eventType];

      if (callbacks) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cb = _step.value;
            cb(eventType, eventArgs);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      _stats.default.get("loader-".concat(eventType)).incrementCount();
    }
  }, {
    key: "subscribe",
    value: function subscribe(instance) {
      this.listeners.push(instance);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(instance) {
      var index = this.listeners.findIndex(function (o) {
        return o === instance;
      });

      if (index >= 0) {
        this.listeners.splice(index, 1);
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.state[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (this.state[key] !== value) {
        this.state[key] = value;
        this._version++;

        if (!this._updateTimer) {
          /* global requestAnimationFrame */
          this._updateTimer = requestAnimationFrame(this._update);
        }
      }
    }
  }, {
    key: "isOpen",

    /* Connection API */
    value: function isOpen() {
      return false;
    }
  }, {
    key: "connect",
    value: function connect() {
      throw new Error('not implemented');
    }
  }, {
    key: "seek",
    value: function seek(timestamp) {
      var metadata = this.getMetadata();

      if (metadata) {
        var startTime = this.getLogStartTime();
        var endTime = this.getLogEndTime();

        if (Number.isFinite(startTime) && Number.isFinite(endTime)) {
          timestamp = (0, _math.clamp)(timestamp, startTime, endTime);
        }
      }

      this.set('timestamp', timestamp); // Notify the stream buffer of the current play head
      // for any data management needs.

      this.streamBuffer.setCurrentTime(timestamp);
    }
  }, {
    key: "setLookAhead",
    value: function setLookAhead(lookAhead) {
      this.set('lookAhead', lookAhead);
    }
  }, {
    key: "updateStreamSettings",
    value: function updateStreamSettings(settings) {
      var streamSettings = this.get('streamSettings');
      this.set('streamSettings', _objectSpread({}, streamSettings, settings));
    }
  }, {
    key: "close",
    value: function close() {
      throw new Error('not implemented');
    }
    /* Data selector API */

  }, {
    key: "_bumpDataVersion",
    value: function _bumpDataVersion() {
      this._updates++;
      this.set('dataVersion', this._updates);
    }
    /* Subclass hooks */

  }, {
    key: "_onXVIZMetadata",
    value: function _onXVIZMetadata(metadata) {
      this.set('metadata', metadata);

      if (metadata.streams && Object.keys(metadata.streams).length > 0) {
        this.set('streamSettings', metadata.streams);
      }

      if (!this.streamBuffer) {
        throw new Error('streamBuffer is missing');
      }

      this.logSynchronizer = this.logSynchronizer || new _parser.StreamSynchronizer(this.streamBuffer);
      var timestamp = this.get('timestamp');
      var newTimestamp = Number.isFinite(timestamp) ? timestamp : metadata.start_time;

      if (Number.isFinite(newTimestamp)) {
        this.seek(newTimestamp);
      }
    }
  }, {
    key: "_onXVIZTimeslice",
    value: function _onXVIZTimeslice(timeslice) {
      var bufferUpdated = this.streamBuffer.insert(timeslice);

      if (bufferUpdated) {
        this._bumpDataVersion();
      }

      return bufferUpdated;
    }
  }, {
    key: "_getDataByStream",
    value: function _getDataByStream() {
      // XVIZStreamBuffer.getStreams filters out missing streams. This has significant impact
      // on performance. Here we take the unfiltered slices and only filter them if a stream
      // is used.
      // return this.streamBuffer.getStreams();
      return this.streamBuffer.streams;
    }
  }, {
    key: "_getBufferedTimeRanges",
    value: function _getBufferedTimeRanges() {
      var range = this.streamBuffer.getLoadedTimeRange();

      if (range) {
        return [[range.start, range.end]];
      }

      return [];
    }
  }, {
    key: "_getLogStartTime",
    value: function _getLogStartTime(metadata) {
      return metadata && metadata.start_time && metadata.start_time + (0, _parser.getXVIZConfig)().TIME_WINDOW;
    }
  }, {
    key: "_getLogEndTime",
    value: function _getLogEndTime(metadata) {
      return metadata && metadata.end_time;
    }
  }, {
    key: "_getBufferStartTime",
    value: function _getBufferStartTime() {
      return this.getLogStartTime();
    }
  }, {
    key: "_getBufferEndTime",
    value: function _getBufferEndTime() {
      return this.getLogEndTime();
    }
  }]);

  return XVIZLoaderInterface;
}();

exports.default = XVIZLoaderInterface;
//# sourceMappingURL=xviz-loader-interface.js.map