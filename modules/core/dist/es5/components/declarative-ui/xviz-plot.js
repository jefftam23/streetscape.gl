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

var GET_X = function GET_X(d) {
  return d[0];
};

var GET_Y = function GET_Y(d) {
  return d[1];
};

var DATA_LOADING = {
  isLoading: true
};

var XVIZPlotComponent =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(XVIZPlotComponent, _PureComponent);

  function XVIZPlotComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, XVIZPlotComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(XVIZPlotComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      independentVariable: null,
      dependentVariables: {}
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClick", function (x) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          log = _this$props.log;

      if (onClick) {
        onClick(x);
      } else if (log) {// TODO - set look ahead
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_formatTitle", function (streamName) {
      // TODO - use information from metadata
      // const {metadata} = this.props;
      // const streamInfo = metadata && metadata.streams[streamName];
      return streamName;
    });

    return _this;
  }

  _createClass(XVIZPlotComponent, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (!nextProps.variables) {
        this.setState({
          independentVariable: null
        });
        return;
      }

      var independentVariable = nextProps.variables[nextProps.independentVariable];
      var independentVariableChanged = false;
      var dependentVariablesChanged = false;
      var updatedDependentVariable = {};

      if (independentVariable !== this.state.independentVariable) {
        independentVariableChanged = true;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = nextProps.dependentVariables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var streamName = _step.value;
          var variable = nextProps.variables[streamName];

          if (independentVariableChanged || !this.props.variables || this.props.variables[streamName] !== variable) {
            updatedDependentVariable[streamName] = this._formatDependentVariable(independentVariable, variable);
            dependentVariablesChanged = true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (independentVariableChanged || dependentVariablesChanged) {
        this.setState({
          independentVariable: independentVariable,
          dependentVariables: _objectSpread({}, this.state.dependentVariables, updatedDependentVariable)
        });
      }
    }
  }, {
    key: "_formatDependentVariable",
    value: function _formatDependentVariable(independentVariable, variable) {
      if (!variable || !independentVariable || independentVariable.length === 0) {
        return null;
      }

      var x = independentVariable[0].values;
      return variable.map(function (_ref) {
        var id = _ref.id,
            values = _ref.values;
        return {
          id: id,
          values: values.map(function (v, k) {
            return [x[k], v];
          })
        };
      });
    }
  }, {
    key: "_extractDataProps",
    value: function _extractDataProps() {
      var _this$state = this.state,
          independentVariable = _this$state.independentVariable,
          dependentVariables = _this$state.dependentVariables;

      if (!independentVariable) {
        return DATA_LOADING;
      }

      var x = independentVariable[0].values;
      var data = {};

      var _loop = function _loop(streamName) {
        var variable = dependentVariables[streamName];

        if (variable) {
          variable.forEach(function (_ref2, i) {
            var id = _ref2.id,
                values = _ref2.values;
            data["".concat(streamName, "-").concat(id || i)] = values;
          });
        }
      };

      for (var streamName in dependentVariables) {
        _loop(streamName);
      }

      return {
        getX: GET_X,
        getY: GET_Y,
        xDomain: [x[0], x[x.length - 1]],
        data: data
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
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

      var dataProps = this._extractDataProps();

      return _react.default.createElement(_monochrome.MetricCard, {
        title: title,
        description: description,
        style: style,
        isLoading: dataProps.isLoading
      }, _react.default.createElement(_monochrome.MetricChart, _extends({}, dataProps, {
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
  }]);

  return XVIZPlotComponent;
}(_react.PureComponent);

_defineProperty(XVIZPlotComponent, "propTypes", {
  // User configuration
  width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  height: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  style: _propTypes.default.object,
  getColor: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object]),
  xTicks: _propTypes.default.number,
  yTicks: _propTypes.default.number,
  formatXTick: _propTypes.default.func,
  formatYTick: _propTypes.default.func,
  horizontalGridLines: _propTypes.default.number,
  verticalGridLines: _propTypes.default.number,
  onClick: _propTypes.default.func,
  // From declarative UI plot component
  title: _propTypes.default.string,
  description: _propTypes.default.string,
  independentVariable: _propTypes.default.string,
  dependentVariables: _propTypes.default.arrayOf(_propTypes.default.string),
  // From connected log
  metadata: _propTypes.default.object,
  variables: _propTypes.default.object
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
  getColor: _constants.DEFAULT_COLOR_SERIES
});

var getLogState = function getLogState(log) {
  var frame = log.getCurrentFrame();
  return {
    metadata: log.getMetadata(),
    variables: frame && frame.variables
  };
};

var _default = (0, _connect.default)({
  getLogState: getLogState,
  Component: XVIZPlotComponent
});

exports.default = _default;
//# sourceMappingURL=xviz-plot.js.map