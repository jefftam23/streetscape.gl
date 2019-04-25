"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _parser = require("@xviz/parser");

var _dualPlaybackControl = _interopRequireDefault(require("./dual-playback-control"));

var _connect = _interopRequireDefault(require("../connect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TIME_SCALES = {
  seconds: 0.001,
  milliseconds: 1
};

var PlaybackControl =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(PlaybackControl, _PureComponent);

  function PlaybackControl() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PlaybackControl);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PlaybackControl)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isPlaying: false,
      timeScale: TIME_SCALES[(0, _parser.getXVIZConfig)().TIMESTAMP_FORMAT] || 1
    });

    _defineProperty(_assertThisInitialized(_this), "_animationFrame", null);

    _defineProperty(_assertThisInitialized(_this), "_lastAnimationUpdate", -1);

    _defineProperty(_assertThisInitialized(_this), "_onPlay", function () {
      _this.props.onPlay();

      _this.setState({
        isPlaying: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onPause", function () {
      _this.props.onPause();

      _this.setState({
        isPlaying: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onSeek", function (timestamp) {
      _this._onTimeChange(timestamp);

      if (_this.state.isPlaying) {
        _this._onPause();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onTimeChange", function (timestamp) {
      var _this$props = _this.props,
          log = _this$props.log,
          onSeek = _this$props.onSeek;

      if (!onSeek(timestamp) && log) {
        log.seek(timestamp);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onLookAheadChange", function (lookAhead) {
      var _this$props2 = _this.props,
          log = _this$props2.log,
          onLookAheadChange = _this$props2.onLookAheadChange;

      if (!onLookAheadChange(lookAhead) && log) {
        log.setLookAhead(lookAhead);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_animate", function () {
      if (_this.state.isPlaying) {
        var now = Date.now();
        var _this$props3 = _this.props,
            startTime = _this$props3.startTime,
            endTime = _this$props3.endTime,
            buffered = _this$props3.buffered,
            timestamp = _this$props3.timestamp;
        var timeScale = _this.state.timeScale;
        var lastUpdate = _this._lastAnimationUpdate;

        var _getXVIZConfig = (0, _parser.getXVIZConfig)(),
            PLAYBACK_FRAME_RATE = _getXVIZConfig.PLAYBACK_FRAME_RATE,
            TIME_WINDOW = _getXVIZConfig.TIME_WINDOW; // avoid skipping frames - cap delta at resolution


        var timeDeltaMs = lastUpdate > 0 ? now - lastUpdate : 0;
        timeDeltaMs = Math.min(timeDeltaMs, 1000 / PLAYBACK_FRAME_RATE);
        var newTimestamp = timestamp + timeDeltaMs * timeScale;

        if (newTimestamp > endTime) {
          newTimestamp = startTime;
        } // check buffer availability


        if (buffered.some(function (r) {
          return newTimestamp >= r[0] && newTimestamp <= r[1] + TIME_WINDOW;
        })) {
          // only move forward if buffer is loaded
          // otherwise pause and wait
          _this._onTimeChange(newTimestamp);
        }

        _this._lastAnimationUpdate = now;
        _this._animationFrame = window.requestAnimationFrame(_this._animate);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_formatTime", function (x) {
      var formatter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var startTime = _this.props.startTime;
      var timeScale = _this.state.timeScale;

      if (formatter) {
        return formatter(x, startTime);
      }

      var deltaTimeS = (x - startTime) / timeScale / 1000;
      return _dualPlaybackControl["default"].formatTimeCode(deltaTimeS, '{mm}:{ss}');
    });

    _defineProperty(_assertThisInitialized(_this), "_formatTick", function (x) {
      return _this._formatTime(x, _this.props.formatTick);
    });

    _defineProperty(_assertThisInitialized(_this), "_formatTimestamp", function (x) {
      return _this._formatTime(x, _this.props.formatTimestamp);
    });

    _defineProperty(_assertThisInitialized(_this), "_formatLookAhead", function (x) {
      var formatLookAhead = _this.props.formatLookAhead;
      var timeScale = _this.state.timeScale;

      if (formatLookAhead) {
        return formatLookAhead(x);
      }

      var deltaTimeS = x / timeScale / 1000;
      return _dualPlaybackControl["default"].formatTimeCode(deltaTimeS, '{s}.{S}s');
    });

    return _this;
  }

  _createClass(PlaybackControl, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if ('isPlaying' in nextProps) {
        this.setState({
          isPlaying: Boolean(nextProps.isPlaying)
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var isPlaying = this.state.isPlaying;

      if (isPlaying && prevState.isPlaying !== isPlaying) {
        this._lastAnimationUpdate = Date.now();
        this._animationFrame = window.requestAnimationFrame(this._animate);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._animationFrame) {
        window.cancelAnimationFrame(this._animationFrame);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          startTime = _this$props4.startTime,
          endTime = _this$props4.endTime,
          timestamp = _this$props4.timestamp,
          lookAhead = _this$props4.lookAhead,
          buffered = _this$props4.buffered,
          otherProps = _objectWithoutProperties(_this$props4, ["startTime", "endTime", "timestamp", "lookAhead", "buffered"]);

      if (!Number.isFinite(timestamp) || !Number.isFinite(startTime)) {
        return null;
      }

      var bufferRange = buffered.map(function (r) {
        return {
          startTime: Math.max(r[0], startTime),
          endTime: Math.min(r[1], endTime)
        };
      });
      return _react["default"].createElement(_dualPlaybackControl["default"], _extends({}, otherProps, {
        bufferRange: bufferRange,
        currentTime: timestamp,
        lookAhead: lookAhead,
        startTime: startTime,
        endTime: endTime,
        isPlaying: this.state.isPlaying,
        formatTick: this._formatTick,
        formatTimestamp: this._formatTimestamp,
        formatLookAhead: this._formatLookAhead,
        onSeek: this._onSeek,
        onPlay: this._onPlay,
        onPause: this._onPause,
        onLookAheadChange: this._onLookAheadChange
      }));
    }
  }]);

  return PlaybackControl;
}(_react.PureComponent);

_defineProperty(PlaybackControl, "propTypes", {
  // from log
  timestamp: _propTypes["default"].number,
  lookAhead: _propTypes["default"].number,
  startTime: _propTypes["default"].number,
  endTime: _propTypes["default"].number,
  buffered: _propTypes["default"].array,
  // state override
  isPlaying: _propTypes["default"].bool,
  // config
  width: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  style: _propTypes["default"].object,
  compact: _propTypes["default"].bool,
  className: _propTypes["default"].string,
  step: _propTypes["default"].number,
  padding: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].object]),
  tickSpacing: _propTypes["default"].number,
  markers: _propTypes["default"].arrayOf(_propTypes["default"].object),
  formatTick: _propTypes["default"].func,
  formatTimestamp: _propTypes["default"].func,
  // dual playback control config
  maxLookAhead: _propTypes["default"].number,
  formatLookAhead: _propTypes["default"].func,
  // callbacks
  onPlay: _propTypes["default"].func,
  onPause: _propTypes["default"].func,
  onSeek: _propTypes["default"].func,
  onLookAheadChange: _propTypes["default"].func
});

_defineProperty(PlaybackControl, "defaultProps", _dualPlaybackControl["default"].defaultProps);

var getLogState = function getLogState(log) {
  return {
    timestamp: log.getCurrentTime(),
    lookAhead: log.getLookAhead(),
    startTime: log.getLogStartTime(),
    endTime: log.getLogEndTime(),
    buffered: log.getBufferedTimeRanges()
  };
};

var _default = (0, _connect["default"])({
  getLogState: getLogState,
  Component: PlaybackControl
});

exports["default"] = _default;
//# sourceMappingURL=index.js.map