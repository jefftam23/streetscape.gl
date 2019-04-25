function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
import styled from '@emotion/styled';
import { Dropdown, withTheme, evaluateStyle } from '@streetscape.gl/monochrome';
import ImageSequence from './image-sequence';
import connectToLog from '../connect';
import { normalizeStreamFilter } from '../../utils/stream-utils';
var WrapperComponent = styled.span(function (props) {
  return _objectSpread({}, props.theme.__reset__, {
    position: 'relative'
  }, evaluateStyle(props.userStyle, props));
});

var BaseComponent =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(BaseComponent, _PureComponent);

  function BaseComponent(props) {
    var _this;

    _classCallCheck(this, BaseComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseComponent).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_onSelectVideo", function (streamName) {
      _this.setState({
        selectedStreamName: streamName
      });
    });

    _this.state = _objectSpread({}, _this._getStreamNames(props));
    return _this;
  }

  _createClass(BaseComponent, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.streamMetadata !== nextProps.streamMetadata || this.props.cameras !== nextProps.cameras) {
        this.setState(this._getStreamNames(nextProps));
      }
    }
  }, {
    key: "_getStreamNames",
    value: function _getStreamNames(_ref) {
      var streamMetadata = _ref.streamMetadata,
          cameras = _ref.cameras;

      if (!streamMetadata) {
        return {
          streamNames: null,
          selectedStreamName: null
        };
      }

      var streamNames = Object.keys(streamMetadata).filter(function (streamName) {
        return streamMetadata[streamName] && streamMetadata[streamName].primitive_type === 'image';
      }).filter(normalizeStreamFilter(cameras)).sort();

      var _ref2 = this.state || {},
          selectedStreamName = _ref2.selectedStreamName;

      if (!streamNames.includes(selectedStreamName)) {
        selectedStreamName = streamNames[0] || null;
      }

      return {
        selectedStreamName: selectedStreamName,
        streamNames: streamNames
      };
    }
  }, {
    key: "_renderVideoSelector",
    value: function _renderVideoSelector() {
      var style = this.props.style;
      var _this$state = this.state,
          streamNames = _this$state.streamNames,
          selectedStreamName = _this$state.selectedStreamName;

      if (streamNames.length <= 1) {
        return null;
      }

      var data = {};
      streamNames.forEach(function (name) {
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
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currentTime = _this$props.currentTime,
          streams = _this$props.streams,
          width = _this$props.width,
          height = _this$props.height,
          style = _this$props.style,
          theme = _this$props.theme;
      var selectedStreamName = this.state.selectedStreamName;

      if (!streams || !currentTime || !selectedStreamName) {
        return null;
      }

      var images = streams[selectedStreamName];

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
  }]);

  return BaseComponent;
}(PureComponent);

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

var getLogState = function getLogState(log) {
  var metadata = log.getMetadata();
  return {
    currentTime: log.getCurrentTime(),
    streamMetadata: metadata && metadata.streams,
    streams: log.getStreams()
  };
};

var XVIZVideoComponent = withTheme(BaseComponent);
export default connectToLog({
  getLogState: getLogState,
  Component: XVIZVideoComponent
});
//# sourceMappingURL=xviz-video.js.map