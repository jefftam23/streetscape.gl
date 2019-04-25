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
import { evaluateStyle } from '@streetscape.gl/monochrome';
import styled from '@emotion/styled';
import BaseWidget from './base-widget';
var Container = styled.div(function (props) {
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
var LightComponent = styled.div(function (props) {
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
  }, evaluateStyle(props.userStyle, props));
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
      return React.createElement(Container, {
        theme: theme,
        layout: style.layout
      }, React.createElement(LightComponent, _extends({
        key: "red",
        color: "red",
        isOn: value === 'red'
      }, styleProps)), React.createElement(LightComponent, _extends({
        key: "yellow",
        color: "yellow",
        isOn: value === 'yellow'
      }, styleProps)), React.createElement(LightComponent, _extends({
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
      return React.createElement(BaseWidget, {
        log: log,
        style: style,
        streamNames: {
          light: streamName
        }
      }, this._render);
    }
  }]);

  return TrafficLightWidget;
}(PureComponent);

_defineProperty(TrafficLightWidget, "propTypes", {
  log: PropTypes.object.isRequired,
  style: PropTypes.object,
  streamName: PropTypes.string.isRequired,
  transformValue: PropTypes.func
});

_defineProperty(TrafficLightWidget, "defaultProps", {
  style: {},
  transformValue: function transformValue(x) {
    return x;
  }
});

export { TrafficLightWidget as default };
//# sourceMappingURL=traffic-light-widget.js.map