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

var _core = require("@deck.gl/core");

var _core2 = require("@luma.gl/core");

var _images = require("@loaders.gl/images");

var _imageryLayerVertex = _interopRequireDefault(require("./imagery-layer-vertex"));

var _imageryLayerFragment = _interopRequireDefault(require("./imagery-layer-fragment"));

var _gridGeometry = _interopRequireDefault(require("./grid-geometry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Load image data into luma.gl Texture2D objects
 * @param {WebGLContext} gl
 * @param {String|Texture2D|HTMLImageElement|Uint8ClampedArray} src - source of image data
 *   can be url string, Texture2D object, HTMLImageElement or pixel array
 * @returns {Promise} resolves to an object with name -> texture mapping
 */
function getTexture(gl, src) {
  if (typeof src === 'string') {
    // Url, load the image
    return (0, _images.loadImage)(src).then(function (data) {
      return getTextureFromData(gl, data);
    }).catch(function (error) {
      throw new Error("Could not load texture from ".concat(src, ": ").concat(error));
    });
  }

  return new Promise(function (resolve) {
    return resolve(getTextureFromData(gl, src));
  });
}
/*
 * Convert image data into texture
 * @returns {Texture2D} texture
 */


function getTextureFromData(gl, data) {
  var _parameters;

  if (data instanceof _core2.Texture2D) {
    return data;
  }

  return new _core2.Texture2D(gl, {
    data: data,
    parameters: (_parameters = {}, _defineProperty(_parameters, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR), _defineProperty(_parameters, gl.TEXTURE_MAG_FILTER, gl.LINEAR), _defineProperty(_parameters, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), _defineProperty(_parameters, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), _parameters)
  });
}

var defaultProps = {
  heightMap: null,
  heightMapBounds: {
    type: 'array',
    value: [0, 0, 1, 1],
    compare: true
  },
  heightRange: {
    type: 'array',
    value: [0, 1],
    compare: true
  },
  imagery: null,
  imageryBounds: {
    type: 'array',
    value: [0, 0, 1, 1],
    compare: true
  },
  uCount: {
    type: 'number',
    value: 1,
    min: 1
  },
  vCount: {
    type: 'number',
    value: 1,
    min: 1
  },
  desaturate: {
    type: 'number',
    value: 0,
    min: 0,
    max: 1
  },
  // More context: because of the blending mode we're using for ground imagery,
  // alpha is not effective when blending the bitmap layers with the base map.
  // Instead we need to manually dim/blend rgb values with a background color.
  transparentColor: {
    type: 'color',
    value: [0, 0, 0, 0]
  },
  tintColor: {
    type: 'color',
    value: [255, 255, 255]
  }
};
/*
 * @class
 * @param {object} props
 * @param {number} props.transparentColor - color to interpret transparency to
 * @param {number} props.tintColor - color bias
 */

var ImageryLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(ImageryLayer, _Layer);

  function ImageryLayer() {
    _classCallCheck(this, ImageryLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(ImageryLayer).apply(this, arguments));
  }

  _createClass(ImageryLayer, [{
    key: "initializeState",
    value: function initializeState() {
      var gl = this.context.gl; // TODO/ib - Enabled to allow debugging of heightmaps, not perfect but really helps

      gl.getExtension('OES_standard_derivatives');
      this.setState({
        model: this.getModel(gl)
      });
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var _this = this;

      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;
      var gl = this.context.gl;
      var model = this.state.model;
      var heightMap = props.heightMap,
          imagery = props.imagery,
          uCount = props.uCount,
          vCount = props.vCount;

      if (heightMap && heightMap !== oldProps.heightMap) {
        getTexture(gl, heightMap).then(function (texture) {
          model.setUniforms({
            heightMapTexture: texture,
            hasHeightMap: true
          });
        });
      }

      if (imagery !== oldProps.imagery) {
        this.setState({
          imageLoaded: false
        });
        getTexture(gl, imagery).then(function (texture) {
          _this.setState({
            imageLoaded: true
          });

          model.setUniforms({
            imageryTexture: texture
          });
        });
      }

      if (uCount !== oldProps.uCount || vCount !== oldProps.vCount) {
        var geometry = new _gridGeometry.default({
          uCount: uCount,
          vCount: vCount
        });
        model.setGeometry(geometry);
      }

      if (changeFlags.propsChanged) {
        var heightMapBounds = props.heightMapBounds,
            heightRange = props.heightRange,
            imageryBounds = props.imageryBounds,
            desaturate = props.desaturate,
            transparentColor = props.transparentColor,
            tintColor = props.tintColor;
        model.setUniforms({
          heightMapBounds: heightMapBounds,
          heightRange: heightRange,
          imageryBounds: imageryBounds,
          desaturate: desaturate,
          transparentColor: transparentColor,
          tintColor: tintColor
        });
      }
    }
  }, {
    key: "draw",
    value: function draw(opts) {
      if (this.state.imageLoaded) {
        this.state.model.draw(opts);
      }
    }
  }, {
    key: "getModel",
    value: function getModel(gl) {
      // 3d surface
      return new _core2.Model(gl, {
        id: this.props.id,
        vs: _imageryLayerVertex.default,
        fs: _imageryLayerFragment.default,
        modules: ['picking', 'project32'],
        shaderCache: this.context.shaderCache,
        vertexCount: 0,
        isIndexed: true
      });
    }
  }]);

  return ImageryLayer;
}(_core.Layer);

exports.default = ImageryLayer;
ImageryLayer.layerName = 'ImageryLayer';
ImageryLayer.defaultProps = defaultProps;
//# sourceMappingURL=imagery-layer.js.map