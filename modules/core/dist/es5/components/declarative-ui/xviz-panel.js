"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _xvizContainer = _interopRequireDefault(require("./xviz-container"));

var _xvizMetric = _interopRequireDefault(require("./xviz-metric"));

var _xvizPlot = _interopRequireDefault(require("./xviz-plot"));

var _xvizTable = _interopRequireDefault(require("./xviz-table"));

var _xvizVideo = _interopRequireDefault(require("./xviz-video"));

var _connect = _interopRequireDefault(require("../connect"));

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// xviz type to component map
var DEFAULT_COMPONENTS = {
  container: _xvizContainer["default"],
  metric: _xvizMetric["default"],
  plot: _xvizPlot["default"],
  video: _xvizVideo["default"],
  table: _xvizTable["default"],
  treetable: _xvizTable["default"]
};

var XVIZPanelComponent =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(XVIZPanelComponent, _PureComponent);

  function XVIZPanelComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, XVIZPanelComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(XVIZPanelComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "_renderItem", function (item, i) {
      var _this$props = _this.props,
          components = _this$props.components,
          componentProps = _this$props.componentProps,
          log = _this$props.log,
          style = _this$props.style;
      var XVIZComponent = components[item.type] || DEFAULT_COMPONENTS[item.type];
      var customProps = componentProps[item.type];

      if (!XVIZComponent) {
        return null;
      }

      return _react["default"].createElement(XVIZComponent, _extends({
        key: i
      }, customProps, item, {
        log: log,
        style: style[item.type]
      }), item.children && item.children.map(_this._renderItem));
    });

    return _this;
  }

  _createClass(XVIZPanelComponent, [{
    key: "render",
    value: function render() {
      var uiConfig = this.props.uiConfig;
      return uiConfig ? _react["default"].createElement("div", null, uiConfig.children && uiConfig.children.map(this._renderItem)) : null;
    }
  }]);

  return XVIZPanelComponent;
}(_react.PureComponent);

_defineProperty(XVIZPanelComponent, "propTypes", {
  // User configuration
  name: _propTypes["default"].string.isRequired,
  components: _propTypes["default"].object,
  componentProps: _propTypes["default"].object,
  style: _propTypes["default"].object,
  // From connected log
  uiConfig: _propTypes["default"].object
});

_defineProperty(XVIZPanelComponent, "defaultProps", {
  style: {},
  components: {},
  componentProps: {}
});

var getLogState = function getLogState(log, ownProps) {
  var metadata = log.getMetadata();
  return {
    uiConfig: metadata && metadata.ui_config && metadata.ui_config[ownProps.name]
  };
};

var _default = (0, _connect["default"])({
  getLogState: getLogState,
  Component: XVIZPanelComponent
});

exports["default"] = _default;
//# sourceMappingURL=xviz-panel.js.map