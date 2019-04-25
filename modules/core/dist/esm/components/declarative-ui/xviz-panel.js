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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import XVIZContainer from './xviz-container';
import XVIZMetric from './xviz-metric';
import XVIZPlot from './xviz-plot';
import XVIZTable from './xviz-table';
import XVIZVideo from './xviz-video';
import connectToLog from '../connect'; // xviz type to component map

var DEFAULT_COMPONENTS = {
  container: XVIZContainer,
  metric: XVIZMetric,
  plot: XVIZPlot,
  video: XVIZVideo,
  table: XVIZTable,
  treetable: XVIZTable
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

      return React.createElement(XVIZComponent, _extends({
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
      return uiConfig ? React.createElement("div", null, uiConfig.children && uiConfig.children.map(this._renderItem)) : null;
    }
  }]);

  return XVIZPanelComponent;
}(PureComponent);

_defineProperty(XVIZPanelComponent, "propTypes", {
  // User configuration
  name: PropTypes.string.isRequired,
  components: PropTypes.object,
  componentProps: PropTypes.object,
  style: PropTypes.object,
  // From connected log
  uiConfig: PropTypes.object
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

export default connectToLog({
  getLogState: getLogState,
  Component: XVIZPanelComponent
});
//# sourceMappingURL=xviz-panel.js.map