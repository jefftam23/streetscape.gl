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

var _monochrome = require("@streetscape.gl/monochrome");

var _constants = require("./constants");

var _connect = _interopRequireDefault(require("../connect"));

var _metricsHelper = require("../../utils/metrics-helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClick", function (x) {
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
      return (0, _metricsHelper.getTimeSeries)({
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
      return _react.default.createElement(_monochrome.MetricCard, {
        title: title,
        description: description,
        isLoading: isLoading,
        style: style
      }, !isLoading && _react.default.createElement(_monochrome.MetricChart, _extends({}, this.state.timeSeries, {
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
}(_react.PureComponent);

_defineProperty(XVIZMetricComponent, "propTypes", {
  // User configuration
  style: _propTypes.default.object,
  width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  height: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  getColor: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string, _propTypes.default.object]),
  xTicks: _propTypes.default.number,
  yTicks: _propTypes.default.number,
  formatXTick: _propTypes.default.func,
  formatYTick: _propTypes.default.func,
  formatValue: _propTypes.default.func,
  horizontalGridLines: _propTypes.default.number,
  verticalGridLines: _propTypes.default.number,
  onClick: _propTypes.default.func,
  // From declarative UI metric component
  streams: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  title: _propTypes.default.string,
  description: _propTypes.default.string,
  // From connected log
  currentTime: _propTypes.default.number,
  metadata: _propTypes.default.object,
  logStreams: _propTypes.default.objectOf(_propTypes.default.array),
  startTime: _propTypes.default.number,
  endTime: _propTypes.default.number
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
  getColor: _constants.DEFAULT_COLOR_SERIES
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

var _default = (0, _connect.default)({
  getLogState: getLogState,
  Component: XVIZMetricComponent
});

exports.default = _default;
//# sourceMappingURL=xviz-metric.js.map