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
import styled from '@emotion/styled';
import { Dropdown, withTheme, evaluateStyle } from '@streetscape.gl/monochrome';
import ImageSequence from './image-sequence';
import connectToLog from '../connect';
import { normalizeStreamFilter } from '../../utils/stream-utils';
const WrapperComponent = styled.span(props => _objectSpread({}, props.theme.__reset__, {
  position: 'relative'
}, evaluateStyle(props.userStyle, props)));

class BaseComponent extends PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "_onSelectVideo", streamName => {
      this.setState({
        selectedStreamName: streamName
      });
    });

    this.state = _objectSpread({}, this._getStreamNames(props));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.streamMetadata !== nextProps.streamMetadata || this.props.cameras !== nextProps.cameras) {
      this.setState(this._getStreamNames(nextProps));
    }
  }

  _getStreamNames(_ref) {
    let streamMetadata = _ref.streamMetadata,
        cameras = _ref.cameras;

    if (!streamMetadata) {
      return {
        streamNames: null,
        selectedStreamName: null
      };
    }

    const streamNames = Object.keys(streamMetadata).filter(streamName => streamMetadata[streamName] && streamMetadata[streamName].primitive_type === 'image').filter(normalizeStreamFilter(cameras)).sort();

    let _ref2 = this.state || {},
        selectedStreamName = _ref2.selectedStreamName;

    if (!streamNames.includes(selectedStreamName)) {
      selectedStreamName = streamNames[0] || null;
    }

    return {
      selectedStreamName,
      streamNames
    };
  }

  _renderVideoSelector() {
    const style = this.props.style;
    const _this$state = this.state,
          streamNames = _this$state.streamNames,
          selectedStreamName = _this$state.selectedStreamName;

    if (streamNames.length <= 1) {
      return null;
    }

    const data = {};
    streamNames.forEach(name => {
      // TODO - use display name from metadata
      data[name] = name;
    });
    return React.createElement(Dropdown, {
      style: style.selector,
      value: selectedStreamName,
      data: data,
      onChange: this._onSelectVideo
    });
  }

  render() {
    const _this$props = this.props,
          currentTime = _this$props.currentTime,
          streams = _this$props.streams,
          width = _this$props.width,
          height = _this$props.height,
          style = _this$props.style,
          theme = _this$props.theme;
    const selectedStreamName = this.state.selectedStreamName;

    if (!streams || !currentTime || !selectedStreamName) {
      return null;
    }

    let images = streams[selectedStreamName];

    if (images) {
      images = images.filter(Boolean);
    }

    return React.createElement(WrapperComponent, {
      theme: theme,
      userStyle: style.wrapper
    }, React.createElement(ImageSequence, {
      width: width,
      height: height,
      src: images,
      currentTime: currentTime
    }), this._renderVideoSelector());
  }

}

_defineProperty(BaseComponent, "propTypes", {
  // User configuration
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // From declarative UI video component
  cameras: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object, PropTypes.func]),
  // From connected log
  currentTime: PropTypes.number,
  streamMetadata: PropTypes.object,
  streams: PropTypes.object
});

_defineProperty(BaseComponent, "defaultProps", {
  style: {},
  width: '100%',
  height: 'auto'
});

const getLogState = log => {
  const metadata = log.getMetadata();
  return {
    currentTime: log.getCurrentTime(),
    streamMetadata: metadata && metadata.streams,
    streams: log.getStreams()
  };
};

const XVIZVideoComponent = withTheme(BaseComponent);
export default connectToLog({
  getLogState,
  Component: XVIZVideoComponent
});
//# sourceMappingURL=xviz-video.js.map