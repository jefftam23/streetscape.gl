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

/* global fetch */
import assert from 'assert';
import { parseStreamMessage, XVIZStreamBuffer } from '@xviz/parser';
import XVIZLoaderInterface from './xviz-loader-interface';
var DEFUALT_BATCH_SIZE = 4;

var XVIZFileLoader =
/*#__PURE__*/
function (_XVIZLoaderInterface) {
  _inherits(XVIZFileLoader, _XVIZLoaderInterface);

  function XVIZFileLoader(options) {
    var _this;

    _classCallCheck(this, XVIZFileLoader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XVIZFileLoader).call(this, options));
    assert(options.timingsFilePath && options.getFilePath);
    _this._timingsFilePath = options.timingsFilePath;
    _this._getFilePath = options.getFilePath;
    _this._batchSize = options.maxConcurrency || DEFUALT_BATCH_SIZE;
    _this.streamBuffer = new XVIZStreamBuffer();
    _this._isOpen = false;
    _this._lastLoadFrame = -1;
    return _this;
  }

  _createClass(XVIZFileLoader, [{
    key: "isOpen",
    value: function isOpen() {
      return this._isOpen;
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      this._isOpen = true;

      this._loadTimings().then(function (data) {
        // Adding 1 is to account for the metadata file
        _this2._numberOfFrames = data.timing.length + 1;

        _this2._loadMetadata().then(function () {
          return _this2._startLoad();
        });
      });
    }
  }, {
    key: "seek",
    value: function seek(timestamp) {
      // TODO incomplete
      _get(_getPrototypeOf(XVIZFileLoader.prototype), "seek", this).call(this, timestamp);
    }
  }, {
    key: "close",
    value: function close() {
      // Stop file loading
      this._isOpen = false;
    }
  }, {
    key: "_loadTimings",
    value: function _loadTimings() {
      return fetch(this._timingsFilePath).then(function (resp) {
        return resp.json();
      });
    }
  }, {
    key: "_loadMetadata",
    value: function _loadMetadata() {
      var metadataPath = this._getFilePath(0);

      assert(metadataPath);
      return this._loadFile(metadataPath, {
        worker: false
      });
    }
  }, {
    key: "_startLoad",
    value: function _startLoad() {
      this._lastLoadFrame = 0; // fetching in parallel

      for (var i = 0; i < this._batchSize && i < this._numberOfFrames; i++) {
        this._loadNextFrame();
      }
    }
  }, {
    key: "_loadNextFrame",
    value: function _loadNextFrame() {
      var _this3 = this;

      if (!this.isOpen()) {
        return;
      }

      this._lastLoadFrame = this._lastLoadFrame + 1;

      if (this._lastLoadFrame >= this._numberOfFrames) {
        this.emit('done');
        return;
      }

      var filePath = this._getFilePath(this._lastLoadFrame);

      assert(filePath);
      Promise.resolve(this._loadFile(filePath, this.options)).then(function () {
        _this3._loadNextFrame();
      });
    }
  }, {
    key: "_loadFile",
    value: function _loadFile(filePath, options) {
      var _this4 = this;

      var fileFormat = filePath.toLowerCase().match(/[^\.]*$/)[0];
      var file;

      switch (fileFormat) {
        case 'glb':
          file = fetch(filePath).then(function (resp) {
            return resp.arrayBuffer();
          });
          break;

        case 'json':
          file = fetch(filePath).then(function (resp) {
            return resp.json();
          });
          break;

        default:
          return Promise.reject('Unknown file format');
      }

      return file.then(function (data) {
        // if not open, do not parse the message
        if (_this4._isOpen) {
          parseStreamMessage({
            message: data,
            onResult: _this4.onXVIZMessage,
            onError: _this4.onError,
            worker: options.worker,
            maxConcurrency: options.maxConcurrency
          });
        }
      });
    }
  }]);

  return XVIZFileLoader;
}(XVIZLoaderInterface);

export { XVIZFileLoader as default };
//# sourceMappingURL=xviz-file-loader.js.map