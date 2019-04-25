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
import { Form, CheckBox, evaluateStyle } from '@streetscape.gl/monochrome';
import styled from '@emotion/styled';
import connectToLog from './connect';
const Badge = styled.div(props => _objectSpread({
  '&:before': {
    content: `"${props.type || ''}"`
  }
}, evaluateStyle(props.userStyle, props)));

function getParentKey(streamName) {
  const i = streamName.indexOf('/', 1);

  if (i > 1) {
    return streamName.slice(0, i);
  }

  return '';
}

function getParentValue(children, values) {
  let parentValue = null;

  for (const key in children) {
    const value = values[key];

    if (parentValue === null) {
      parentValue = value;
    } else if (parentValue !== value) {
      return CheckBox.INDETERMINATE;
    }
  }

  return parentValue;
} // Created 1-level nested form structure


export function createFormData(metadata, opts) {
  if (!metadata) {
    return null;
  }

  const root = {};
  const _opts$style = opts.style,
        style = _opts$style === void 0 ? {} : _opts$style;

  for (const streamName in metadata) {
    const parentKey = getParentKey(streamName);
    let siblings = root;

    if (parentKey) {
      root[parentKey] = root[parentKey] || {
        type: 'checkbox',
        children: {},
        badge: React.createElement(Badge, {
          userStyle: style.badge
        })
      };
      siblings = root[parentKey].children;
    }

    siblings[streamName] = {
      type: 'checkbox',
      title: streamName.replace(parentKey, ''),
      badge: React.createElement(Badge, {
        userStyle: style.badge,
        type: metadata[streamName].primitive_type || metadata[streamName].scalar_type
      })
    };
  }

  return root;
}
export function settingsToFormValues(data, settings) {
  if (!data || !settings) {
    return null;
  }

  const values = {};

  for (const key in data) {
    const children = data[key].children;

    if (children) {
      // is parent
      for (const streamName in children) {
        values[streamName] = settings[streamName] ? CheckBox.ON : CheckBox.OFF;
      }

      values[key] = getParentValue(children, values);
    } else {
      // is leaf
      values[key] = settings[key] ? CheckBox.ON : CheckBox.OFF;
    }
  }

  return values;
}
export function updateFormValues(data, oldValues, newValues) {
  const values = _objectSpread({}, oldValues, newValues);

  for (const key in newValues) {
    if (data[key] && data[key].children) {
      // is parent, reset child values
      for (const streamName in data[key].children) {
        values[streamName] = newValues[key];
      }
    } else {
      // is leaf, re-evaluate parent value
      const parentKey = getParentKey(key);

      if (parentKey) {
        values[parentKey] = getParentValue(data[parentKey].children, values);
      }
    }
  }

  return values;
}
export function formValuesToSettings(metadata, values) {
  const settings = {};

  for (const streamName in metadata) {
    settings[streamName] = values[streamName] === CheckBox.ON;
  }

  return settings;
}

class StreamSettingsPanel extends PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "_onValuesChange", newValues => {
      const _this$props = this.props,
            streamMetadata = _this$props.streamMetadata,
            log = _this$props.log,
            onSettingsChange = _this$props.onSettingsChange;
      const data = this.state.data;
      const values = updateFormValues(data, this.state.values, newValues);
      const settings = formValuesToSettings(streamMetadata, values);

      if (!onSettingsChange(settings) && log) {
        log.updateStreamSettings(settings);
      }
    });

    const _data = createFormData(props.streamMetadata, props);

    const _values = settingsToFormValues(_data, props.streamSettings);

    this.state = {
      data: _data,
      values: _values
    };
  }

  componentWillReceiveProps(nextProps) {
    let _this$state = this.state,
        data = _this$state.data,
        values = _this$state.values;

    if (nextProps.streamMetadata !== this.props.streamMetadata) {
      data = createFormData(nextProps.streamMetadata, nextProps);
      values = null;
    }

    if (nextProps.streamSettings !== this.props.streamSettings) {
      values = settingsToFormValues(data, nextProps.streamSettings);
    }

    this.setState({
      data,
      values
    });
  }

  render() {
    const style = this.props.style;
    const _this$state2 = this.state,
          data = _this$state2.data,
          values = _this$state2.values;

    if (!data || !values) {
      return null;
    }

    return React.createElement(Form, {
      style: style,
      data: data,
      values: values,
      onChange: this._onValuesChange
    });
  }

}

_defineProperty(StreamSettingsPanel, "propTypes", {
  style: PropTypes.object,
  streamMetadata: PropTypes.object,
  onSettingsChange: PropTypes.func
});

_defineProperty(StreamSettingsPanel, "defaultProps", {
  style: {},
  onSettingsChange: () => {}
});

const getLogState = log => {
  const metadata = log.getMetadata();
  return {
    streamMetadata: metadata && metadata.streams,
    streamSettings: log.getStreamSettings()
  };
};

export default connectToLog({
  getLogState,
  Component: StreamSettingsPanel
});
//# sourceMappingURL=stream-settings-panel.js.map