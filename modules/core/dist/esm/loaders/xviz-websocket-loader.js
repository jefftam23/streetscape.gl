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
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

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

/* global WebSocket,ArrayBuffer */

/* eslint-disable camelcase */
import assert from 'assert';
import { XVIZStreamBuffer, parseStreamMessage } from '@xviz/parser';
import PromiseRetry from 'promise-retry';
import XVIZLoaderInterface from './xviz-loader-interface';
import XVIZController from './xviz-controller-v2';
/**
 * Connect to XVIZ 2 websocket manage storage of XVIZ data into a XVIZStreamBuffer
 *
 * This class is a Websocket base class and is expected to be subclassed with
 * the following methods overridden:
 *
 * - _onOpen()
 */

var XVIZWebsocketLoader =
/*#__PURE__*/
function (_XVIZLoaderInterface) {
  _inherits(XVIZWebsocketLoader, _XVIZLoaderInterface);

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
  function XVIZWebsocketLoader() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, XVIZWebsocketLoader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XVIZWebsocketLoader).call(this, options));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onWSOpen", function () {
      // Request data if we are restarting, otherwise wait for metadata
      // TODO - protocol negotiation
      _this.xvizHandler = new XVIZController(_this.socket);

      _this._debug('socket_open', _this.requestParams);

      _this._onOpen();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onWSClose", function (event) {
      // Only called on connection closure, which would be an error case
      _this._debug('socket_closed', event);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onWSError", function (event) {
      _this._debug('socket_error', event);
    });

    _this.socket = null;
    _this.retrySettings = {
      retries: 3,
      minTimeout: 500,
      randomize: true
    };
    _this.streamBuffer = new XVIZStreamBuffer(); // Handler object for the websocket events
    // Note: needs to be last due to member dependencies

    _this.WebSocketClass = options.WebSocketClass || WebSocket;
    return _this;
  }

  _createClass(XVIZWebsocketLoader, [{
    key: "isOpen",
    value: function isOpen() {
      return this.socket; // && this.socket.readyState === WEB_SOCKET_OPEN_STATE;
    }
  }, {
    key: "seek",
    value: function seek(timestamp) {
      _get(_getPrototypeOf(XVIZWebsocketLoader.prototype), "seek", this).call(this, timestamp);
    }
    /**
     * Open an XVIZ socket connection with automatic retry
     *
     * @returns {Promise} WebSocket connection
     */

  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      assert(this.socket === null, 'Socket Manager still connected');

      this._debug('stream_start');

      var url = this.requestParams.url; // Wrap retry logic around connection

      return PromiseRetry(function (retry) {
        return new Promise(function (resolve, reject) {
          try {
            var ws = new _this2.WebSocketClass(url);
            ws.binaryType = 'arraybuffer';

            ws.onmessage = function (message) {
              var hasMetadata = Boolean(_this2.getMetadata());
              return parseStreamMessage({
                message: message.data,
                onResult: _this2.onXVIZMessage,
                onError: _this2.onError,
                debug: _this2._debug.bind('parse_message'),
                worker: hasMetadata && _this2.options.worker,
                maxConcurrency: _this2.options.maxConcurrency
              });
            };

            ws.onerror = _this2.onError;

            ws.onclose = function (event) {
              _this2._onWSClose(event);

              reject(event);
            }; // On success, resolve the promise with the now ready socket


            ws.onopen = function () {
              _this2.socket = ws;

              _this2._onWSOpen();

              resolve(ws);
            };
          } catch (err) {
            reject(err);
          }
        }).catch(function (event) {
          _this2._onWSError(event);

          var isAbnormalClosure = event.code > 1000 && event.code !== 1005; // Retry if abnormal or connection never established

          if (isAbnormalClosure || !_this2.socket) {
            retry();
          }
        });
      }, this.retrySettings).catch(this._onWSError);
    }
  }, {
    key: "close",
    value: function close() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    } // Subclasses *MUST* implement these methods

  }, {
    key: "_onOpen",
    value: function _onOpen() {
      throw new Error('_onOpen() method must be overridden');
    } // PRIVATE Methods
    // Notifications and metric reporting

  }]);

  return XVIZWebsocketLoader;
}(XVIZLoaderInterface);

export { XVIZWebsocketLoader as default };
//# sourceMappingURL=xviz-websocket-loader.js.map