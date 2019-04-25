"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactMapGl = require("react-map-gl");

var _monochrome = require("@streetscape.gl/monochrome");

var _styled = _interopRequireDefault(require("@emotion/styled"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Copied from 'react-map-gl/src/utils/dynamic-position.js'
var ANCHOR_POSITION = {
  top: {
    x: 0.5,
    y: 0
  },
  'top-left': {
    x: 0,
    y: 0
  },
  'top-right': {
    x: 1,
    y: 0
  },
  bottom: {
    x: 0.5,
    y: 1
  },
  'bottom-left': {
    x: 0,
    y: 1
  },
  'bottom-right': {
    x: 1,
    y: 1
  },
  left: {
    x: 0,
    y: 0.5
  },
  right: {
    x: 1,
    y: 0.5
  }
};

var PopupTip = _styled["default"].div(function (props) {
  return _objectSpread({
    position: 'absolute',
    width: 4,
    height: 4,
    margin: -2,
    borderRadius: 2,
    background: props.color
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var PopupLine = _styled["default"].div(function (props) {
  return _objectSpread({
    position: 'absolute',
    borderLeftStyle: 'solid',
    borderLeftWidth: 1,
    borderColor: props.color
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var PopupContent = _styled["default"].div(function (props) {
  return _objectSpread({}, props.theme.__reset__, {
    background: props.color
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});
/* Like Popup but deal with z */


var PerspectivePopup =
/*#__PURE__*/
function (_Popup) {
  _inherits(PerspectivePopup, _Popup);

  function PerspectivePopup() {
    _classCallCheck(this, PerspectivePopup);

    return _possibleConstructorReturn(this, _getPrototypeOf(PerspectivePopup).apply(this, arguments));
  }

  _createClass(PerspectivePopup, [{
    key: "_renderTip",
    value: function _renderTip(positionType) {
      var anchorPosition = ANCHOR_POSITION[positionType];
      var _this$props = this.props,
          theme = _this$props.theme,
          style = _this$props.style;
      var _style$objectLabelTip = style.objectLabelTipSize,
          objectLabelTipSize = _style$objectLabelTip === void 0 ? 30 : _style$objectLabelTip,
          _style$objectLabelCol = style.objectLabelColor,
          objectLabelColor = _style$objectLabelCol === void 0 ? theme.background : _style$objectLabelCol;

      var styleProps = _objectSpread({}, this.props.styleProps, {
        theme: theme,
        color: objectLabelColor,
        position: positionType
      });

      var tipSize = (0, _monochrome.evaluateStyle)(objectLabelTipSize, styleProps);
      var tipStyle = {
        width: tipSize,
        height: tipSize,
        position: 'relative',
        border: 'none'
      };
      var tipCircleStyle = {};
      var tipLineStyle = {};

      switch (anchorPosition.x) {
        case 0.5:
          tipCircleStyle.left = '50%';
          tipLineStyle.left = '50%';
          break;

        case 1:
          tipCircleStyle.right = 0;
          tipLineStyle.right = 0;
          break;

        case 0:
        default:
      }

      switch (anchorPosition.y) {
        case 0.5:
          tipLineStyle.width = '100%';
          tipCircleStyle.top = '50%';
          tipLineStyle.top = '50%';
          break;

        case 1:
          tipCircleStyle.bottom = 0;
          tipLineStyle.height = '100%';
          break;

        case 0:
        default:
          tipLineStyle.height = '100%';
      }

      return _react["default"].createElement("div", {
        key: "tip",
        className: "mapboxgl-popup-tip",
        style: tipStyle
      }, _react["default"].createElement(PopupTip, _extends({
        style: tipCircleStyle
      }, styleProps, {
        userStyle: style.objectLabelTip
      })), _react["default"].createElement(PopupLine, _extends({
        style: tipLineStyle
      }, styleProps, {
        userStyle: style.objectLabelLine
      })));
    }
  }, {
    key: "_renderContent",
    value: function _renderContent() {
      var _this$props2 = this.props,
          theme = _this$props2.theme,
          styleProps = _this$props2.styleProps,
          style = _this$props2.style;
      return _react["default"].createElement(PopupContent, _extends({
        key: "content",
        ref: this._contentLoaded,
        className: "mapboxgl-popup-content",
        theme: theme
      }, styleProps, {
        color: style.objectLabelColor,
        userStyle: style.objectLabelBody
      }), this.props.children);
    }
  }]);

  return PerspectivePopup;
}(_reactMapGl.Popup);

var _default = (0, _monochrome.withTheme)(PerspectivePopup);

exports["default"] = _default;
//# sourceMappingURL=perspective-popup.js.map