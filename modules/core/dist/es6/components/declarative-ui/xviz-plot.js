function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
import { MetricCard, MetricChart } from '@streetscape.gl/monochrome';
import { DEFAULT_COLOR_SERIES } from './constants';
import connectToLog from '../connect';

const GET_X = d => d[0];

const GET_Y = d => d[1];

const DATA_LOADING = {
  isLoading: true
};

class XVIZPlotComponent extends PureComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      independentVariable: null,
      dependentVariables: {}
    });

    _defineProperty(this, "_onClick", x => {
      const _this$props = this.props,
            onClick = _this$props.onClick,
            log = _this$props.log;

      if (onClick) {
        onClick(x);
      } else if (log) {// TODO - set look ahead
      }
    });

    _defineProperty(this, "_formatTitle", streamName => {
      // TODO - use information from metadata
      // const {metadata} = this.props;
      // const streamInfo = metadata && metadata.streams[streamName];
      return streamName;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.variables) {
      this.setState({
        independentVariable: null
      });
      return;
    }

    const independentVariable = nextProps.variables[nextProps.independentVariable];
    let independentVariableChanged = false;
    let dependentVariablesChanged = false;
    const updatedDependentVariable = {};

    if (independentVariable !== this.state.independentVariable) {
      independentVariableChanged = true;
    }

    for (const streamName of nextProps.dependentVariables) {
      const variable = nextProps.variables[streamName];

      if (independentVariableChanged || !this.props.variables || this.props.variables[streamName] !== variable) {
        updatedDependentVariable[streamName] = this._formatDependentVariable(independentVariable, variable);
        dependentVariablesChanged = true;
      }
    }

    if (independentVariableChanged || dependentVariablesChanged) {
      this.setState({
        independentVariable,
        dependentVariables: _objectSpread({}, this.state.dependentVariables, updatedDependentVariable)
      });
    }
  }

  _formatDependentVariable(independentVariable, variable) {
    if (!variable || !independentVariable || independentVariable.length === 0) {
      return null;
    }

    const x = independentVariable[0].values;
    return variable.map((_ref) => {
      let id = _ref.id,
          values = _ref.values;
      return {
        id,
        values: values.map((v, k) => [x[k], v])
      };
    });
  }

  _extractDataProps() {
    const _this$state = this.state,
          independentVariable = _this$state.independentVariable,
          dependentVariables = _this$state.dependentVariables;

    if (!independentVariable) {
      return DATA_LOADING;
    }

    const x = independentVariable[0].values;
    const data = {};

    for (const streamName in dependentVariables) {
      const variable = dependentVariables[streamName];

      if (variable) {
        variable.forEach((_ref2, i) => {
          let id = _ref2.id,
              values = _ref2.values;
          data["".concat(streamName, "-").concat(id || i)] = values;
        });
      }
    }

    return {
      getX: GET_X,
      getY: GET_Y,
      xDomain: [x[0], x[x.length - 1]],
      data
    };
  }

  render() {
    const _this$props2 = this.props,
          title = _this$props2.title,
          description = _this$props2.description,
          width = _this$props2.width,
          height = _this$props2.height,
          style = _this$props2.style,
          xTicks = _this$props2.xTicks,
          yTicks = _this$props2.yTicks,
          formatXTick = _this$props2.formatXTick,
          formatYTick = _this$props2.formatYTick,
          horizontalGridLines = _this$props2.horizontalGridLines,
          verticalGridLines = _this$props2.verticalGridLines,
          getColor = _this$props2.getColor;

    const dataProps = this._extractDataProps();

    return React.createElement(MetricCard, {
      title: title,
      description: description,
      style: style,
      isLoading: dataProps.isLoading
    }, React.createElement(MetricChart, _extends({}, dataProps, {
      getColor: getColor,
      highlightX: 0,
      width: width,
      height: height,
      style: style,
      xTicks: xTicks,
      yTicks: yTicks,
      formatXTick: formatXTick,
      formatYTick: formatYTick,
      onClick: this._onClick,
      formatTitle: this._formatTitle,
      horizontalGridLines: horizontalGridLines,
      verticalGridLines: verticalGridLines
    })));
  }

}

_defineProperty(XVIZPlotComponent, "propTypes", {
  // User configuration
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  getColor: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  xTicks: PropTypes.number,
  yTicks: PropTypes.number,
  formatXTick: PropTypes.func,
  formatYTick: PropTypes.func,
  horizontalGridLines: PropTypes.number,
  verticalGridLines: PropTypes.number,
  onClick: PropTypes.func,
  // From declarative UI plot component
  title: PropTypes.string,
  description: PropTypes.string,
  independentVariable: PropTypes.string,
  dependentVariables: PropTypes.arrayOf(PropTypes.string),
  // From connected log
  metadata: PropTypes.object,
  variables: PropTypes.object
});

_defineProperty(XVIZPlotComponent, "defaultProps", {
  metadata: {},
  variables: {},
  width: '100%',
  height: 300,
  style: {
    margin: {
      left: 45,
      right: 10,
      top: 10,
      bottom: 32
    }
  },
  xTicks: 0,
  yTicks: 5,
  horizontalGridLines: 5,
  verticalGridLines: 0,
  getColor: DEFAULT_COLOR_SERIES
});

const getLogState = log => {
  const frame = log.getCurrentFrame();
  return {
    metadata: log.getMetadata(),
    variables: frame && frame.variables
  };
};

export default connectToLog({
  getLogState,
  Component: XVIZPlotComponent
});
//# sourceMappingURL=xviz-plot.js.map