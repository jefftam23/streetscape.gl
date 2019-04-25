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
import { MetricCard, MetricChart } from '@streetscape.gl/monochrome';
import { DEFAULT_COLOR_SERIES } from './constants';
import connectToLog from '../connect';
import { getTimeSeries } from '../../utils/metrics-helper';

var defaultFormatValue = function defaultFormatValue(x) {
  return Number.isFinite(x) ? x.toFixed(3) : String(x);
};

var XVIZMetricComponent =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(XVIZMetricComponent, _PureComponent);

  function XVIZMetricComponent(props) {
    var _this;

    _classCallCheck(this, XVIZMetricComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XVIZMetricComponent).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_onClick", function (x) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          log = _this$props.log;

      if (onClick) {
        onClick(x);
      } else if (log) {
        log.seek(x);
      }
    });

    _this.state = {
      timeSeries: _this._getTimeSeries(props)
    };
    return _this;
  }

  _createClass(XVIZMetricComponent, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.streams !== nextProps.streams || this.props.metadata !== nextProps.metadata || this.props.logStreams !== nextProps.logStreams) {
        this.setState({
          timeSeries: this._getTimeSeries(nextProps)
        });
      }
    }
  }, {
    key: "_getTimeSeries",
    value: function _getTimeSeries(props) {
      return getTimeSeries({
        streamNames: props.streams,
        metadata: props.metadata,
        streams: props.logStreams
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          title = _this$props2.title,
          description = _this$props2.description,
          startTime = _this$props2.startTime,
          endTime = _this$props2.endTime,
          currentTime = _this$props2.currentTime,
          width = _this$props2.width,
          height = _this$props2.height,
          style = _this$props2.style,
          xTicks = _this$props2.xTicks,
          yTicks = _this$props2.yTicks,
          formatXTick = _this$props2.formatXTick,
          formatYTick = _this$props2.formatYTick,
          formatValue = _this$props2.formatValue,
          horizontalGridLines = _this$props2.horizontalGridLines,
          verticalGridLines = _this$props2.verticalGridLines,
          getColor = _this$props2.getColor;
      var isLoading = currentTime === null;
      var timeDomain = Number.isFinite(startTime) ? [startTime, endTime] : null;
      return React.createElement(MetricCard, {
        title: title,
        description: description,
        isLoading: isLoading,
        style: style
      }, !isLoading && React.createElement(MetricChart, _extends({}, this.state.timeSeries, {
        getColor: getColor,
        highlightX: currentTime,
        width: width,
        height: height,
        style: style,
        xTicks: xTicks,
        yTicks: yTicks,
        formatXTick: formatXTick,
        formatYTick: formatYTick,
        formatValue: formatValue,
        xDomain: timeDomain,
        onClick: this._onClick,
        horizontalGridLines: horizontalGridLines,
        verticalGridLines: verticalGridLines
      })));
    }
  }]);

  return XVIZMetricComponent;
}(PureComponent);

_defineProperty(XVIZMetricComponent, "propTypes", {
  // User configuration
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getColor: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.object]),
  xTicks: PropTypes.number,
  yTicks: PropTypes.number,
  formatXTick: PropTypes.func,
  formatYTick: PropTypes.func,
  formatValue: PropTypes.func,
  horizontalGridLines: PropTypes.number,
  verticalGridLines: PropTypes.number,
  onClick: PropTypes.func,
  // From declarative UI metric component
  streams: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  // From connected log
  currentTime: PropTypes.number,
  metadata: PropTypes.object,
  logStreams: PropTypes.objectOf(PropTypes.array),
  startTime: PropTypes.number,
  endTime: PropTypes.number
});

_defineProperty(XVIZMetricComponent, "defaultProps", {
  timeSeries: {},
  width: '100%',
  height: 160,
  style: {
    margin: {
      left: 45,
      right: 10,
      top: 10,
      bottom: 20
    }
  },
  xTicks: 0,
  yTicks: 3,
  formatValue: defaultFormatValue,
  horizontalGridLines: 3,
  verticalGridLines: 0,
  getColor: DEFAULT_COLOR_SERIES
});

var getLogState = function getLogState(log) {
  return {
    currentTime: log.getCurrentTime(),
    metadata: log.getMetadata(),
    logStreams: log.getStreams(),
    startTime: log.getBufferStartTime(),
    endTime: log.getBufferEndTime()
  };
};

export default connectToLog({
  getLogState: getLogState,
  Component: XVIZMetricComponent
});
//# sourceMappingURL=xviz-metric.js.map