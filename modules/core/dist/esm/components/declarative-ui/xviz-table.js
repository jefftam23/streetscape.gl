function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
import { Table, TreeTable, Tooltip } from '@streetscape.gl/monochrome';
import PropTypes from 'prop-types';
import connectToLog from '../connect';

var XVIZTableComponent =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(XVIZTableComponent, _PureComponent);

  function XVIZTableComponent(props) {
    var _this;

    _classCallCheck(this, XVIZTableComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(XVIZTableComponent).call(this, props));
    _this.state = _objectSpread({}, _this._formatData(props));
    return _this;
  }

  _createClass(XVIZTableComponent, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.columns !== this.props.columns || nextProps.nodes !== this.props.nodes) {
        this.setState(this._formatData(nextProps));
      }
    }
  }, {
    key: "_formatData",
    value: function _formatData(_ref) {
      var columns = _ref.columns,
          nodes = _ref.nodes,
          displayObjectId = _ref.displayObjectId;

      if (!columns || !nodes) {
        return {
          columns: null
        };
      }

      columns = columns.map(function (col) {
        return {
          name: col.display_text,
          type: col.type
        };
      });
      var rowIds = {};
      var rows = [];
      nodes.forEach(function (node) {
        var row = {
          data: node.column_values || [],
          children: []
        };
        rowIds[node.id] = row;

        if (node.parent === undefined) {
          rows.push(row);
        } else {
          var parentRow = rowIds[node.parent];

          if (parentRow) {
            parentRow.children.push(row);
          }
        }
      });
      return {
        columns: columns,
        rows: rows
      };
    }
  }, {
    key: "render",
    value: function render() {
      console.log('JEFF: Hello from my fork');
      var _this$state = this.state,
          columns = _this$state.columns,
          rows = _this$state.rows;

      if (!columns) {
        // TODO - show loading message
        return null;
      }

      var _this$props = this.props,
          title = _this$props.title,
          description = _this$props.description,
          width = _this$props.width,
          height = _this$props.height,
          style = _this$props.style,
          renderHeader = _this$props.renderHeader,
          renderCell = _this$props.renderCell,
          indentSize = _this$props.indentSize,
          type = _this$props.type;
      var Component = type === 'table' ? Table : TreeTable;
      return React.createElement("div", {
        style: {
          width: width,
          height: height
        }
      }, React.createElement(Tooltip, {
        content: description
      }, React.createElement("h4", null, title)), React.createElement(Component, {
        width: "100%",
        height: "100%",
        style: style,
        renderHeader: renderHeader,
        renderCell: renderCell,
        indentSize: indentSize,
        columns: columns,
        rows: rows
      }));
    }
  }]);

  return XVIZTableComponent;
}(PureComponent);

_defineProperty(XVIZTableComponent, "propTypes", {
  // UI configuration
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  renderHeader: PropTypes.func,
  renderCell: PropTypes.func,
  indentSize: PropTypes.number,
  // From declarative UI table component
  stream: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  displayObjectId: PropTypes.bool,
  // From connected log
  columns: PropTypes.array,
  nodes: PropTypes.array
});

_defineProperty(XVIZTableComponent, "defaultProps", {
  width: '100%',
  height: 400,
  style: {},
  indentSize: 12,
  renderHeader: function renderHeader(_ref2) {
    var column = _ref2.column;
    return column.name;
  },
  renderCell: function renderCell(_ref3) {
    var value = _ref3.value;
    return value === null ? null : String(value);
  }
});

var getLogState = function getLogState(log, ownProps) {
  var frame = log.getCurrentFrame();
  var data = frame && frame.streams[ownProps.stream];
  return data && data.treetable;
};

export default connectToLog({
  getLogState: getLogState,
  Component: XVIZTableComponent
});
//# sourceMappingURL=xviz-table.js.map