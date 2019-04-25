"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _monochrome = require("@streetscape.gl/monochrome");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _math = require("math.gl");

var _baseWidget = _interopRequireDefault(require("./base-widget"));

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

var GuageArc = _styled["default"].path(function (props) {
  return _objectSpread({
    stroke: props.theme.controlColorDisabled,
    strokeCap: 'round'
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var ZeroMarker = _styled["default"].circle(function (props) {
  return _objectSpread({
    fill: props.theme.textColorPrimary
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var CmdMarker = _styled["default"].path(function (props) {
  return _objectSpread({
    fill: props.theme.controlColorActive
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var GuageHand = _styled["default"].line(function (props) {
  return _objectSpread({
    stroke: props.theme.textColorPrimary,
    strokeCap: 'round',
    strokeWidth: 2
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var CmdValue = _styled["default"].div(function (props) {
  return _objectSpread({
    textAlign: 'right',
    flex: 1,
    padding: props.theme.spacingTiny,
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: props.theme.controlColorDisabled,
    color: props.warning ? props.theme.textColorWarning : props.theme.textColorPrimary,
    fontSize: props.theme.fontSize * 2,
    lineHeight: '1em'
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var MsrValue = _styled["default"].div(function (props) {
  return _objectSpread({
    textAlign: props.isOnlyValue ? 'center' : 'left',
    flex: 1,
    padding: props.theme.spacingTiny,
    fontSize: props.theme.fontSize * 2,
    color: props.warning ? props.theme.textColorWarning : props.theme.textColorPrimary,
    lineHeight: '1em'
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var LabelComponent = _styled["default"].div(function (props) {
  return _objectSpread({
    fontSize: props.theme.fontSize,
    color: props.theme.textColorSecondary,
    lineHeight: '1em'
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var UnitsComponent = _styled["default"].div(function (props) {
  return _objectSpread({
    textAlign: 'center',
    fontSize: props.theme.fontSize * 0.9,
    color: props.theme.textColorSecondary
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var Warning = _styled["default"].span(function (props) {
  return _objectSpread({
    position: 'absolute',
    marginLeft: props.theme.spacingTiny,
    fontSize: props.theme.fontSize * 0.9,
    lineHeight: '1em',
    padding: props.theme.spacingTiny,
    borderRadius: 2,
    background: props.theme.warning400,
    color: props.theme.textColorInvert
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

function getTransform(centerX, centerY, angle) {
  return "translate(".concat(centerX, " ").concat(centerY, ") rotate(").concat(angle, ") translate(").concat(-centerX, " ").concat(-centerY, ")");
}

function formatValue(value) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var transformValue = arguments.length > 2 ? arguments[2] : undefined;

  if (!Number.isFinite(value)) {
    return '';
  }

  value = transformValue(value);
  var digits = value ? Math.max(1, Math.floor(Math.log10(Math.abs(value)) + 1)) : 1;
  return "".concat(value.toFixed(Math.max(0, precision - digits)));
}

var MeterWidget =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(MeterWidget, _PureComponent);

  function MeterWidget() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MeterWidget);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MeterWidget)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "_render", function (_ref) {
      var theme = _ref.theme,
          streams = _ref.streams;
      return _react["default"].createElement("div", null, _this._renderGauge(streams.cmd, streams.msr, theme), _this._renderMetric(streams.cmd, streams.msr, theme));
    });

    return _this;
  }

  _createClass(MeterWidget, [{
    key: "_renderGauge",
    value: function _renderGauge(cmdData, msrData, theme) {
      var _this$props = this.props,
          min = _this$props.min,
          max = _this$props.max,
          transformValue = _this$props.transformValue,
          style = _this$props.style;
      var _style$arcRadius = style.arcRadius,
          r = _style$arcRadius === void 0 ? 50 : _style$arcRadius,
          _style$arcWidth = style.arcWidth,
          w = _style$arcWidth === void 0 ? 8 : _style$arcWidth;
      var padding = 8;

      if (r <= w / 2) {
        return null;
      }

      var cmdValue = transformValue(cmdData && cmdData.data && cmdData.data.variable || 0);
      var msrValue = transformValue(msrData.data && msrData.data.variable || 0);
      var msr = (0, _math.clamp)((msrValue - min) / (max - min), 0, 1);
      var cmd = (0, _math.clamp)((cmdValue - min) / (max - min), 0, 1);
      var zero = (0, _math.clamp)((0 - min) / (max - min), 0, 1);
      var msrTransform = getTransform(r + padding, r + padding, msr * 180 - 90);
      var cmdTransform = getTransform(r + padding, r + padding, cmd * 180 - 90);
      var zeroTransform = getTransform(r + padding, r + padding, zero * 180 - 90);
      return _react["default"].createElement("svg", {
        width: (r + padding) * 2,
        height: r + padding * 2
      }, _react["default"].createElement(GuageArc, {
        d: "M ".concat(padding + w / 2, " ").concat(r + padding, " a ").concat(r - w / 2, " ").concat(r - w / 2, " 1 1 1 ").concat(r * 2 - w, " 0"),
        fill: "none",
        strokeWidth: w,
        theme: theme,
        userStyle: style.arc
      }), _react["default"].createElement("g", {
        transform: zeroTransform
      }, _react["default"].createElement(ZeroMarker, {
        cx: r + padding,
        cy: padding - 4,
        r: 2,
        theme: theme,
        userStyle: style.zeroMarker
      })), cmdData && _react["default"].createElement("g", {
        transform: cmdTransform
      }, _react["default"].createElement(CmdMarker, {
        transform: "translate(".concat(r + padding, " ").concat(padding, ")"),
        d: "M0,".concat(w, " L").concat(-w / 2, ",0 L").concat(w / 2, ",0z"),
        theme: theme,
        userStyle: style.cmdMarker
      })), msrData && _react["default"].createElement("g", {
        transform: msrTransform
      }, _react["default"].createElement(GuageHand, {
        x1: r + padding,
        y1: r + padding,
        x2: r + padding,
        y2: padding + w + 4,
        theme: theme,
        userStyle: style.hand
      })));
    }
  }, {
    key: "_renderMetric",
    value: function _renderMetric(cmdData, msrData, theme) {
      var _this$props2 = this.props,
          label = _this$props2.label,
          _this$props2$units = _this$props2.units,
          units = _this$props2$units === void 0 ? msrData.units : _this$props2$units,
          transformValue = _this$props2.transformValue,
          precision = _this$props2.precision,
          getWarning = _this$props2.getWarning,
          style = _this$props2.style;
      var cmdValue = cmdData && cmdData.data && cmdData.data.variable;
      var msrValue = msrData.data && msrData.data.variable;
      var cmdWarning = getWarning(cmdValue);
      var msrWarning = getWarning(msrValue);
      return _react["default"].createElement("div", null, _react["default"].createElement("div", {
        style: {
          display: 'flex'
        }
      }, cmdData && _react["default"].createElement(CmdValue, {
        theme: theme,
        warning: cmdWarning,
        userStyle: style.cmdValue
      }, _react["default"].createElement(LabelComponent, {
        theme: theme,
        warning: cmdWarning,
        userStyle: style.label
      }, "Cmd."), _react["default"].createElement("div", null, formatValue(cmdValue, precision, transformValue) || '-')), _react["default"].createElement(MsrValue, {
        theme: theme,
        warning: msrWarning,
        isOnlyValue: !cmdData,
        userStyle: style.msrValue
      }, _react["default"].createElement(LabelComponent, {
        theme: theme,
        warning: msrWarning,
        userStyle: style.label
      }, label), _react["default"].createElement("div", null, formatValue(msrValue, precision, transformValue) || '-'))), _react["default"].createElement(UnitsComponent, {
        theme: theme,
        userStyle: style.units
      }, units, (cmdWarning || msrWarning) && _react["default"].createElement(Warning, {
        theme: theme,
        userStyle: style.warning
      }, cmdWarning || msrWarning)));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          log = _this$props3.log,
          style = _this$props3.style,
          cmdStreamName = _this$props3.cmdStreamName,
          streamName = _this$props3.streamName;
      return _react["default"].createElement(_baseWidget["default"], {
        log: log,
        style: style,
        streamNames: {
          cmd: cmdStreamName,
          msr: streamName
        }
      }, this._render);
    }
  }]);

  return MeterWidget;
}(_react.PureComponent);

exports["default"] = MeterWidget;

_defineProperty(MeterWidget, "propTypes", {
  log: _propTypes["default"].object.isRequired,
  style: _propTypes["default"].object,
  precision: _propTypes["default"].number,
  units: _propTypes["default"].string,
  cmdStreamName: _propTypes["default"].string,
  streamName: _propTypes["default"].string.isRequired,
  label: _propTypes["default"].string,
  min: _propTypes["default"].number.isRequired,
  max: _propTypes["default"].number.isRequired,
  transformValue: _propTypes["default"].func,
  getWarning: _propTypes["default"].func
});

_defineProperty(MeterWidget, "defaultProps", {
  precision: 3,
  style: {},
  transformValue: function transformValue(x) {
    return x;
  },
  getWarning: function getWarning(_) {
    return null;
  }
});
//# sourceMappingURL=meter-widget.js.map