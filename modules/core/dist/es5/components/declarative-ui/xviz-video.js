"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _monochrome = require("@streetscape.gl/monochrome");

var _imageSequence = _interopRequireDefault(require("./image-sequence"));

var _connect = _interopRequireDefault(require("../connect"));

var _streamUtils = require("../../utils/stream-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WrapperComponent = _styled["default"].span(function (props) {
  return _objectSpread({}, props.theme.__reset__, {
    position: 'relative'
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var BaseComponent =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(BaseComponent, _PureComponent);

  function BaseComponent(props) {
    var _this;

    _classCallCheck(this, BaseComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseComponent).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_onSelectVideo", function (streamName) {
      _this.setState({
        selectedStreamName: streamName
      });
    });

    _this.state = _objectSpread({}, _this._getStreamNames(props));
    return _this;
  }

  _createClass(BaseComponent, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.streamMetadata !== nextProps.streamMetadata || this.props.cameras !== nextProps.cameras) {
        this.setState(this._getStreamNames(nextProps));
      }
    }
  }, {
    key: "_getStreamNames",
    value: function _getStreamNames(_ref) {
      var streamMetadata = _ref.streamMetadata,
          cameras = _ref.cameras;

      if (!streamMetadata) {
        return {
          streamNames: null,
          selectedStreamName: null
        };
      }

      var streamNames = Object.keys(streamMetadata).filter(function (streamName) {
        return streamMetadata[streamName] && streamMetadata[streamName].primitive_type === 'image';
      }).filter((0, _streamUtils.normalizeStreamFilter)(cameras)).sort();

      var _ref2 = this.state || {},
          selectedStreamName = _ref2.selectedStreamName;

      if (!streamNames.includes(selectedStreamName)) {
        selectedStreamName = streamNames[0] || null;
      }

      return {
        selectedStreamName: selectedStreamName,
        streamNames: streamNames
      };
    }
  }, {
    key: "_renderVideoSelector",
    value: function _renderVideoSelector() {
      var style = this.props.style;
      var _this$state = this.state,
          streamNames = _this$state.streamNames,
          selectedStreamName = _this$state.selectedStreamName;

      if (streamNames.length <= 1) {
        return null;
      }

      var data = {};
      streamNames.forEach(function (name) {
        // TODO - use display name from metadata
        data[name] = name;
      });
      return _react["default"].createElement(_monochrome.Dropdown, {
        style: style.selector,
        value: selectedStreamName,
        data: data,
        onChange: this._onSelectVideo
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currentTime = _this$props.currentTime,
          streams = _this$props.streams,
          width = _this$props.width,
          height = _this$props.height,
          style = _this$props.style,
          theme = _this$props.theme;
      var selectedStreamName = this.state.selectedStreamName;

      if (!streams || !currentTime || !selectedStreamName) {
        return null;
      }

      var images = streams[selectedStreamName];

      if (images) {
        images = images.filter(Boolean);
      }

      return _react["default"].createElement(WrapperComponent, {
        theme: theme,
        userStyle: style.wrapper
      }, _react["default"].createElement(_imageSequence["default"], {
        width: width,
        height: height,
        src: images,
        currentTime: currentTime
      }), this._renderVideoSelector());
    }
  }]);

  return BaseComponent;
}(_react.PureComponent);

_defineProperty(BaseComponent, "propTypes", {
  // User configuration
  style: _propTypes["default"].object,
  width: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  height: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  // From declarative UI video component
  cameras: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].array, _propTypes["default"].object, _propTypes["default"].func]),
  // From connected log
  currentTime: _propTypes["default"].number,
  streamMetadata: _propTypes["default"].object,
  streams: _propTypes["default"].object
});

_defineProperty(BaseComponent, "defaultProps", {
  style: {},
  width: '100%',
  height: 'auto'
});

var getLogState = function getLogState(log) {
  var metadata = log.getMetadata();
  return {
    currentTime: log.getCurrentTime(),
    streamMetadata: metadata && metadata.streams,
    streams: log.getStreams()
  };
};

var XVIZVideoComponent = (0, _monochrome.withTheme)(BaseComponent);

var _default = (0, _connect["default"])({
  getLogState: getLogState,
  Component: XVIZVideoComponent
});

exports["default"] = _default;
//# sourceMappingURL=xviz-video.js.map