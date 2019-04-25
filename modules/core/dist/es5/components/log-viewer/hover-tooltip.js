"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _monochrome = require("@streetscape.gl/monochrome");

var _styled = _interopRequireDefault(require("@emotion/styled"));

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

var TooltipContainer = _styled["default"].div(function (props) {
  return _objectSpread({}, props.theme.__reset__, {
    position: 'absolute',
    pointerEvents: 'none',
    margin: props.theme.spacingNormal,
    padding: props.theme.spacingNormal,
    maxWidth: 320,
    overflow: 'hidden',
    background: props.theme.background,
    color: props.theme.textColorPrimary,
    zIndex: 100001
  }, (0, _monochrome.evaluateStyle)(props.userStyle, props));
});

var KEY_BLACKLIST = new Set(['vertices', 'base', 'style', 'state', 'index', 'id', 'object_id']);

var HoverTooltip =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(HoverTooltip, _PureComponent);

  function HoverTooltip() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, HoverTooltip);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(HoverTooltip)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "_renderContent", function (info) {
      var objectId = info.object.base && info.object.base.object_id;
      return [_react["default"].createElement("div", {
        key: "-stream-"
      }, _react["default"].createElement("div", null, _react["default"].createElement("b", null, "stream")), info.layer.props.streamName), objectId ? _react["default"].createElement("div", {
        key: "-id-"
      }, _react["default"].createElement("div", null, _react["default"].createElement("b", null, "id")), objectId) : null, _react["default"].createElement("hr", {
        key: "-separator-"
      })].concat(_this._renderEntries(info.object.base), _this._renderEntries(info.object));
    });

    return _this;
  }

  _createClass(HoverTooltip, [{
    key: "_renderEntries",
    value: function _renderEntries(object) {
      if (!object) {
        return null;
      }

      return Object.keys(object).filter(function (key) {
        return !KEY_BLACKLIST.has(key) && object[key] !== undefined;
      }).map(function (key) {
        return _react["default"].createElement("div", {
          key: key
        }, _react["default"].createElement("div", null, _react["default"].createElement("b", null, key)), String(object[key]));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          theme = _this$props.theme,
          info = _this$props.info,
          style = _this$props.style,
          _this$props$renderCon = _this$props.renderContent,
          renderContent = _this$props$renderCon === void 0 ? this._renderContent : _this$props$renderCon;
      return _react["default"].createElement(TooltipContainer, {
        theme: theme,
        style: {
          left: info.x,
          top: info.y
        },
        userStyle: style
      }, renderContent(info));
    }
  }]);

  return HoverTooltip;
}(_react.PureComponent);

var _default = (0, _monochrome.withTheme)(HoverTooltip);

exports["default"] = _default;
//# sourceMappingURL=hover-tooltip.js.map