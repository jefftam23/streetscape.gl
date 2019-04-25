"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _parser = require("@xviz/parser");

var _xvizWebsocketLoader = _interopRequireDefault(require("./xviz-websocket-loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var DEFAULT_LOG_PROFILE = 'default';
var DEFAULT_RETRY_ATTEMPTS = 3;

function getSocketRequestParams(options) {
  var _options$logProfile = options.logProfile,
      logProfile = _options$logProfile === void 0 ? DEFAULT_LOG_PROFILE : _options$logProfile,
      serverConfig = options.serverConfig,
      _options$bufferLength = options.bufferLength,
      bufferLength = _options$bufferLength === void 0 ? 30 : _options$bufferLength;

  var queryParams = _objectSpread({}, serverConfig.queryParams, {
    profile: logProfile
  });

  var retryAttempts = Number.isInteger(serverConfig.retryAttempts) ? serverConfig.retryAttempts : DEFAULT_RETRY_ATTEMPTS;
  var qs = Object.keys(queryParams).map(function (key) {
    return "".concat(key, "=").concat(queryParams[key]);
  }).join('&');
  return {
    url: "".concat(serverConfig.serverUrl, "?").concat(qs),
    logProfile: logProfile,
    bufferLength: bufferLength,
    retryAttempts: retryAttempts,
    serverConfig: serverConfig
  };
}
/*
 * Handle connecting to XVIZ socket and negotiation of the XVIZ protocol version
 *
 * This loader is used when connecting to a "live" XVIZ websocket.
 * This implies that the metadata does not have a start or end time
 * and that we want to display the latest message as soon as it arrives.
 */


var XVIZLiveLoader =
/*#__PURE__*/
function (_XVIZWebsocketLoader) {
  _inherits(XVIZLiveLoader, _XVIZWebsocketLoader);

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
  function XVIZLiveLoader() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, XVIZLiveLoader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XVIZLiveLoader).call(this, options)); // Construct websocket connection details from parameters

    _defineProperty(_assertThisInitialized(_this), "_onOpen", function () {});

    _this.requestParams = getSocketRequestParams(options);
    (0, _assert["default"])(_this.requestParams.bufferLength, 'bufferLength must be provided');
    _this.retrySettings = {
      retries: _this.requestParams.retryAttempts,
      minTimeout: 500,
      randomize: true
    }; // Setup relative stream buffer storage by splitting bufferLength 1/3 : 2/3

    var bufferChunk = _this.requestParams.bufferLength / 3; // Replace base class object

    _this.streamBuffer = new _parser.XVIZStreamBuffer({
      startOffset: -2 * bufferChunk,
      endOffset: bufferChunk
    });
    return _this;
  }

  _createClass(XVIZLiveLoader, [{
    key: "seek",
    value: function seek(timestamp) {
      _get(_getPrototypeOf(XVIZLiveLoader.prototype), "seek", this).call(this, timestamp); // Info the streamBuffer so it can prune appropriately


      this.streamBuffer.setCurrentTime(timestamp);
    }
    /* Hook overrides */

  }, {
    key: "_getBufferStartTime",
    value: function _getBufferStartTime() {
      return this.streamBuffer.getBufferRange().start;
    }
  }, {
    key: "_getBufferEndTime",
    value: function _getBufferEndTime() {
      return this.streamBuffer.getBufferRange().end;
    }
  }, {
    key: "_onXVIZTimeslice",
    value: function _onXVIZTimeslice(message) {
      _get(_getPrototypeOf(XVIZLiveLoader.prototype), "_onXVIZTimeslice", this).call(this, message); // Live loader always shows latest data


      this.seek(message.timestamp);
    }
  }]);

  return XVIZLiveLoader;
}(_xvizWebsocketLoader["default"]);

exports["default"] = XVIZLiveLoader;
//# sourceMappingURL=xviz-live-loader.js.map