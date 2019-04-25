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
import { Table, TreeTable, Tooltip } from '@streetscape.gl/monochrome';
import PropTypes from 'prop-types';
import connectToLog from '../connect';

class XVIZTableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = _objectSpread({}, this._formatData(props));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.columns !== this.props.columns || nextProps.nodes !== this.props.nodes) {
      this.setState(this._formatData(nextProps));
    }
  }

  _formatData(_ref) {
    let columns = _ref.columns,
        nodes = _ref.nodes,
        displayObjectId = _ref.displayObjectId;

    if (!columns || !nodes) {
      return {
        columns: null
      };
    }

    columns = columns.map(col => ({
      name: col.display_text,
      type: col.type
    }));
    const rowIds = {};
    const rows = [];
    nodes.forEach(node => {
      const row = {
        data: node.column_values || [],
        children: []
      };
      rowIds[node.id] = row;

      if (node.parent === undefined) {
        rows.push(row);
      } else {
        const parentRow = rowIds[node.parent];

        if (parentRow) {
          parentRow.children.push(row);
        }
      }
    });
    return {
      columns,
      rows
    };
  }

  render() {
    console.log('JEFF: Hello from my fork');
    const _this$state = this.state,
          columns = _this$state.columns,
          rows = _this$state.rows;

    if (!columns) {
      // TODO - show loading message
      return null;
    }

    const _this$props = this.props,
          title = _this$props.title,
          description = _this$props.description,
          width = _this$props.width,
          height = _this$props.height,
          style = _this$props.style,
          renderHeader = _this$props.renderHeader,
          renderCell = _this$props.renderCell,
          indentSize = _this$props.indentSize,
          type = _this$props.type;
    const Component = type === 'table' ? Table : TreeTable;
    return React.createElement("div", {
      style: {
        width,
        height
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

}

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
  renderHeader: (_ref2) => {
    let column = _ref2.column;
    return column.name;
  },
  renderCell: (_ref3) => {
    let value = _ref3.value;
    return value === null ? null : String(value);
  }
});

const getLogState = (log, ownProps) => {
  const frame = log.getCurrentFrame();
  const data = frame && frame.streams[ownProps.stream];
  return data && data.treetable;
};

export default connectToLog({
  getLogState,
  Component: XVIZTableComponent
});
//# sourceMappingURL=xviz-table.js.map