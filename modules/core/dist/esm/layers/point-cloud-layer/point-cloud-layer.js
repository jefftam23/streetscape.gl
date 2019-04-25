function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
import { PointCloudLayer as CorePointCloudLayer } from '@deck.gl/layers';
import vs from './point-cloud-layer-vertex.glsl';
/* eslint-disable camelcase */

var COLOR_MODE = {
  "default": 0,
  elevation: 1,
  distance_to_vehicle: 2
};
var COLOR_DOMAIN = {
  "default": [0, 0],
  elevation: [0, 3],
  distance_to_vehicle: [0, 60]
};
/* eslint-enable camelcase */

var defaultProps = {
  colorMode: 'default',
  colorDomain: null
};

var PointCloudLayer =
/*#__PURE__*/
function (_CorePointCloudLayer) {
  _inherits(PointCloudLayer, _CorePointCloudLayer);

  function PointCloudLayer() {
    _classCallCheck(this, PointCloudLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(PointCloudLayer).apply(this, arguments));
  }

  _createClass(PointCloudLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var shaders = _get(_getPrototypeOf(PointCloudLayer.prototype), "getShaders", this).call(this);

      shaders.vs = vs;
      return shaders;
    }
  }, {
    key: "updateState",
    value: function updateState(params) {
      _get(_getPrototypeOf(PointCloudLayer.prototype), "updateState", this).call(this, params);

      var props = params.props,
          oldProps = params.oldProps;

      if (props.modelMatrix !== oldProps.modelMatrix || props.vehicleRelativeTransform !== oldProps.vehicleRelativeTransform) {
        var vehicleDistanceTransform = props.vehicleRelativeTransform.clone().invert();

        if (props.modelMatrix) {
          vehicleDistanceTransform.multiplyRight(props.modelMatrix);
        }

        this.setState({
          vehicleDistanceTransform: vehicleDistanceTransform
        });
      }

      if (props.instanceColors !== oldProps.instanceColors) {
        var _this$getAttributeMan = this.getAttributeManager().getAttributes(),
            instanceColors = _this$getAttributeMan.instanceColors;

        var colorSize = props.instanceColors ? props.instanceColors.length / props.numInstances : 4;
        instanceColors.size = colorSize;
        this.setState({
          colorSize: colorSize
        });
      }
    }
  }, {
    key: "draw",
    value: function draw(_ref) {
      var uniforms = _ref.uniforms;
      var _this$props = this.props,
          pointSize = _this$props.pointSize,
          colorMode = _this$props.colorMode,
          colorDomain = _this$props.colorDomain;
      var _this$state = this.state,
          vehicleDistanceTransform = _this$state.vehicleDistanceTransform,
          colorSize = _this$state.colorSize;
      this.state.model.setUniforms(Object.assign({}, uniforms, {
        pointSize: pointSize,
        colorSize: colorSize,
        colorMode: COLOR_MODE[colorMode] || COLOR_MODE["default"],
        colorDomain: colorDomain || COLOR_DOMAIN[colorMode] || COLOR_DOMAIN["default"],
        vehicleDistanceTransform: vehicleDistanceTransform
      })).draw();
    }
  }]);

  return PointCloudLayer;
}(CorePointCloudLayer);

export { PointCloudLayer as default };
PointCloudLayer.layerName = 'PointCloudLayer';
PointCloudLayer.defaultProps = defaultProps;
//# sourceMappingURL=point-cloud-layer.js.map