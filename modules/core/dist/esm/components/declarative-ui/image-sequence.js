function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from '@streetscape.gl/monochrome';
import ImageBuffer from '../../utils/image-buffer';
/* Component that renders image sequence as video */

var ImageSequence =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ImageSequence, _PureComponent);

  function ImageSequence(props) {
    var _this;

    _classCallCheck(this, ImageSequence);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageSequence).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_onCanvasLoad", function (ref) {
      _this._canvas = ref;

      if (ref) {
        _this._context = ref.getContext('2d');
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onCanvasResize", function (_ref) {
      var width = _ref.width,
          height = _ref.height;

      _this.setState({
        width: width,
        height: height
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_getVideoFilterCSS", function () {
      var _this$props = _this.props,
          brightness = _this$props.brightness,
          contrast = _this$props.contrast,
          saturate = _this$props.saturate,
          invert = _this$props.invert;
      var filter = "      ".concat(Number.isFinite(brightness) ? "brightness(".concat(brightness, ") ") : '', "      ").concat(Number.isFinite(saturate) ? "saturate(".concat(saturate, ") ") : '', "      ").concat(Number.isFinite(contrast) ? "contrast(".concat(contrast, ") ") : '', "      ").concat(Number.isFinite(invert) ? "invert(".concat(invert, ") ") : '');
      return filter;
    });

    _defineProperty(_assertThisInitialized(_this), "_renderFrame", function () {
      if (!_this._context) {
        return;
      }

      var width = _this.state.width;
      var height = _this.state.height;

      if (!width) {
        return;
      }

      _this._context.filter = _this._getVideoFilterCSS();
      var currentFrameImage = _this.state.currentFrameImage;

      if (!currentFrameImage) {
        _this._context.clearRect(0, 0, width, height);
      } else {
        if (_this.props.height === 'auto') {
          height = width / currentFrameImage.width * currentFrameImage.height;
        }

        _this._canvas.width = width;
        _this._canvas.height = height;

        _this._context.drawImage(currentFrameImage, 0, 0, width, height);
      }
    });

    _this._buffer = new ImageBuffer(10);
    _this.state = _objectSpread({
      width: 0,
      height: 0
    }, _this._getCurrentFrames(props));
    _this._canvas = null;
    _this._context = null;
    return _this;
  }

  _createClass(ImageSequence, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._renderFrame();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState(_objectSpread({}, this._getCurrentFrames(nextProps)));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.currentFrameImage !== prevState.currentFrameImage || this.state.width !== prevState.width || this.state.height !== prevState.height) {
        this._renderFrame();
      }
    }
  }, {
    key: "_getCurrentFrames",
    value: function _getCurrentFrames(props) {
      var _this2 = this;

      var currentTime = props.currentTime,
          src = props.src;

      var currentFrame = this._buffer.set(src, currentTime);

      var currentFrameData = this._buffer.get(currentFrame);

      if (currentFrameData && !currentFrameData.image) {
        currentFrameData.promise.then(function (image) {
          if (_this2.state.currentFrame === currentFrame) {
            _this2.setState({
              currentFrameImage: image
            });
          }
        });
      }

      return {
        currentFrameImage: currentFrameData && currentFrameData.image,
        currentFrame: currentFrame
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          width = _this$props2.width,
          height = _this$props2.height;
      var style = {
        position: 'relative',
        background: '#000',
        lineHeight: 0,
        width: width,
        height: height
      };
      return React.createElement("div", {
        style: style
      }, React.createElement(AutoSizer, {
        onResize: this._onCanvasResize
      }), React.createElement("canvas", {
        ref: this._onCanvasLoad
      }));
    }
  }]);

  return ImageSequence;
}(PureComponent);

_defineProperty(ImageSequence, "propTypes", {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Array of frames to render, in shape of {timestamp, imageUrl}
  src: PropTypes.array,
  // eslint-disable-line
  // Filters
  brightness: PropTypes.number,
  contrast: PropTypes.number,
  saturate: PropTypes.number,
  invert: PropTypes.number,
  currentTime: PropTypes.number.isRequired
});

_defineProperty(ImageSequence, "defaultProps", {
  width: '100%',
  height: 'auto',
  // brightness: 1.0,
  // contrast: 1.0,
  // saturate: 1.0,
  // invert: 0.0,
  src: []
});

export { ImageSequence as default };
//# sourceMappingURL=image-sequence.js.map