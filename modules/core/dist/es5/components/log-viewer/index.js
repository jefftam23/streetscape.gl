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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _objectState = require("../../utils/object-state");

var _core3dViewer = _interopRequireDefault(require("./core-3d-viewer"));

var _hoverTooltip = _interopRequireDefault(require("./hover-tooltip"));

var _connect = _interopRequireDefault(require("../connect"));

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};

var preventDefault = function preventDefault(evt) {
  return evt.preventDefault();
};

var LogViewer =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(LogViewer, _PureComponent);

  function LogViewer(props) {
    var _this;

    _classCallCheck(this, LogViewer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LogViewer).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onViewStateChange", function (_ref) {
      var viewState = _ref.viewState,
          viewOffset = _ref.viewOffset;

      _this.setState({
        viewState: viewState,
        viewOffset: viewOffset
      });

      _this.props.onViewStateChange({
        viewState: viewState,
        viewOffset: viewOffset
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onHoverObject", function (info, evt) {
      if (_this.props.showTooltip && info && info.object) {
        _this.setState({
          hoverInfo: info
        });
      } else if (_this.state.hoverInfo) {
        _this.setState({
          hoverInfo: null
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClickObject", function (info, evt) {
      _this.props.onClick(info, evt);

      var objectId = info && info.object && info.object.id;

      if (objectId && !_this.props.onSelectObject(info, evt)) {
        // User callback did not mark event as handled, proceed with default behavior
        // Select object
        var objectStates = _this.state.objectStates;
        var isObjectSelected = objectStates.selected && objectStates.selected[objectId];
        objectStates = (0, _objectState.setObjectState)(objectStates, {
          stateName: 'selected',
          id: objectId,
          value: !isObjectSelected
        });

        _this.setState({
          objectStates: objectStates
        });

        _this.props.onObjectStateChange(objectStates);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onContextMenu", function (info, evt) {
      _this.props.onContextMenu(info, evt);
    });

    _this.state = {
      viewState: _objectSpread({
        width: 1,
        height: 1,
        longitude: 0,
        latitude: 0
      }, _constants.DEFAULT_VIEW_STATE, props.viewMode.initialViewState),
      viewOffset: {
        x: 0,
        y: 0,
        bearing: 0
      },
      objectStates: {},
      hoverInfo: null
    };
    return _this;
  }

  _createClass(LogViewer, [{
    key: "_renderTooltip",
    value: function _renderTooltip() {
      var _this$props = this.props,
          showTooltip = _this$props.showTooltip,
          style = _this$props.style,
          renderTooltip = _this$props.renderTooltip;
      var hoverInfo = this.state.hoverInfo;
      return showTooltip && hoverInfo && _react.default.createElement(_hoverTooltip.default, {
        info: hoverInfo,
        style: style.tooltip,
        renderContent: renderTooltip
      });
    }
  }, {
    key: "render",
    value: function render() {
      var viewState = this.props.viewState || this.state.viewState;
      var viewOffset = this.props.viewOffset || this.state.viewOffset;
      var objectStates = this.props.objectStates || this.state.objectStates;
      return _react.default.createElement("div", {
        onContextMenu: preventDefault
      }, _react.default.createElement(_core3dViewer.default, _extends({}, this.props, {
        onViewStateChange: this._onViewStateChange,
        onClick: this._onClickObject,
        onHover: this._onHoverObject,
        onContextMenu: this._onContextMenu,
        viewState: viewState,
        viewOffset: viewOffset,
        objectStates: objectStates
      }), this._renderTooltip()));
    }
  }]);

  return LogViewer;
}(_react.PureComponent);

_defineProperty(LogViewer, "propTypes", _objectSpread({}, _core3dViewer.default.propTypes, {
  // Props from loader
  frame: _propTypes.default.object,
  metadata: _propTypes.default.object,
  // Rendering options
  renderTooltip: _propTypes.default.func,
  style: _propTypes.default.object,
  // Callbacks
  onSelectObject: _propTypes.default.func,
  onContextMenu: _propTypes.default.func,
  onViewStateChange: _propTypes.default.func,
  onObjectStateChange: _propTypes.default.func,
  // Optional: to use with external state management (e.g. Redux)
  viewState: _propTypes.default.object,
  viewOffset: _propTypes.default.object,
  objectStates: _propTypes.default.object
}));

_defineProperty(LogViewer, "defaultProps", _objectSpread({}, _core3dViewer.default.defaultProps, {
  style: {},
  onViewStateChange: noop,
  onObjectStateChange: noop,
  onSelectObject: noop,
  onContextMenu: noop,
  getTransformMatrix: function getTransformMatrix(streamName, context) {
    return null;
  }
}));

var getLogState = function getLogState(log) {
  return {
    frame: log.getCurrentFrame(),
    metadata: log.getMetadata()
  };
};

var _default = (0, _connect.default)({
  getLogState: getLogState,
  Component: LogViewer
});

exports.default = _default;
//# sourceMappingURL=index.js.map