"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _monochrome = require("@streetscape.gl/monochrome");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _baseWidget = _interopRequireDefault(require("./base-widget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var Container = _styled["default"].div(function (props) {
  return {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: props.layout === 'vertical' ? 'column' : 'row'
  };
});

var COLORS = {
  red: '#d42e22',
  yellow: '#f8ce46',
  green: '#57ad57'
};

var LightComponent = _styled["default"].div(function (props) {
  return _objectSpread({
    boxSizing: 'border-box',
    width: props.theme.controlSize,
    height: props.theme.controlSize,
    margin: props.theme.spacingTiny,
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: COLORS[props.color],
    background: props.isOn ? COLORS[props.color] : 'none'
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var TrafficLightWidget =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(TrafficLightWidget, _PureComponent);

  function TrafficLightWidget() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TrafficLightWidget);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TrafficLightWidget)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "_render", function (_ref) {
      var theme = _ref.theme,
          streams = _ref.streams;
      var _this$props = _this.props,
          transformValue = _this$props.transformValue,
          style = _this$props.style;
      var value = streams.light.data && transformValue(streams.light.data.variable);
      var styleProps = {
        theme: theme,
        userStyle: style.light
      };
      return _react["default"].createElement(Container, {
        theme: theme,
        layout: style.layout
      }, _react["default"].createElement(LightComponent, _extends({
        key: "red",
        color: "red",
        isOn: value === 'red'
      }, styleProps)), _react["default"].createElement(LightComponent, _extends({
        key: "yellow",
        color: "yellow",
        isOn: value === 'yellow'
      }, styleProps)), _react["default"].createElement(LightComponent, _extends({
        key: "green",
        color: "green",
        isOn: value === 'green'
      }, styleProps)));
    });

    return _this;
  }

  _createClass(TrafficLightWidget, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          log = _this$props2.log,
          style = _this$props2.style,
          streamName = _this$props2.streamName;
      return _react["default"].createElement(_baseWidget["default"], {
        log: log,
        style: style,
        streamNames: {
          light: streamName
        }
      }, this._render);
    }
  }]);

  return TrafficLightWidget;
}(_react.PureComponent);

exports["default"] = TrafficLightWidget;

_defineProperty(TrafficLightWidget, "propTypes", {
  log: _propTypes["default"].object.isRequired,
  style: _propTypes["default"].object,
  streamName: _propTypes["default"].string.isRequired,
  transformValue: _propTypes["default"].func
});

_defineProperty(TrafficLightWidget, "defaultProps", {
  style: {},
  transformValue: function transformValue(x) {
    return x;
  }
});
//# sourceMappingURL=traffic-light-widget.js.map