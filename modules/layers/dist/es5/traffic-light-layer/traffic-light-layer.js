"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@deck.gl/core");

var _core2 = require("@luma.gl/core");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _trafficLightLayerVertex = _interopRequireDefault(require("./traffic-light-layer-vertex.glsl"));

var _trafficLightLayerFragment = _interopRequireDefault(require("./traffic-light-layer-fragment.glsl"));

var _trafficLightUtils = require("./traffic-light-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var fp64LowPart = _core2.fp64.fp64LowPart;
var LIGHT_COLOR = {
  invalid: [0, 0, 0],
  green: [0, 255, 128],
  yellow: [255, 250, 0],
  red: [255, 16, 16]
};
/* eslint-disable camelcase */

var LIGHT_SHAPE = {
  circular: 0,
  left_arrow: 1,
  right_arrow: 2
};
/* eslint-enable camelcase */

var defaultProps = {
  getPosition: {
    type: 'accessor',
    value: function value(x) {
      return x.position;
    }
  },
  getAngle: {
    type: 'accessor',
    value: 0
  },
  getShape: {
    type: 'accessor',
    value: function value(x) {
      return 'circular';
    }
  },
  getColor: {
    type: 'accessor',
    value: function value(x) {
      return 'green';
    }
  },
  getState: {
    type: 'accessor',
    value: 1
  },
  sizeScale: {
    type: 'number',
    value: 0.15,
    min: 0
  },
  fp64: false,
  material: new _core2.PhongMaterial({
    shininess: 0,
    specularColor: [0, 0, 0]
  })
};

var TrafficLightLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(TrafficLightLayer, _Layer);

  function TrafficLightLayer() {
    _classCallCheck(this, TrafficLightLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(TrafficLightLayer).apply(this, arguments));
  }

  _createClass(TrafficLightLayer, [{
    key: "getShaders",
    value: function getShaders() {
      var projectModule = this.use64bitProjection() ? 'project64' : 'project32';
      return {
        vs: _trafficLightLayerVertex["default"],
        fs: _trafficLightLayerFragment["default"],
        modules: [projectModule, 'gouraud-lighting', 'picking']
      };
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      var gl = this.context.gl;

      var modelsByName = this._getModels(gl);

      this.setState({
        models: [modelsByName.box, modelsByName.lights],
        modelsByName: modelsByName
      });
      var attributeManager = this.getAttributeManager();
      /* eslint-disable max-len */

      attributeManager.addInstanced({
        instancePositions: {
          size: 3,
          accessor: 'getPosition'
        },
        instancePositions64xyLow: {
          size: 2,
          accessor: 'getPosition',
          update: this.calculateInstancePositions64xyLow
        },
        instanceAngles: {
          size: 1,
          accessor: 'getAngle'
        },
        instanceShapes: {
          size: 1,
          type: _constants["default"].UNSIGNED_BYTE,
          accessor: 'getShape',
          update: this.calculateInstanceShapes
        },
        instanceColors: {
          size: 3,
          type: _constants["default"].UNSIGNED_BYTE,
          accessor: 'getColor',
          update: this.calculateInstanceColors
        },
        instanceStates: {
          size: 1,
          type: _constants["default"].UNSIGNED_BYTE,
          accessor: 'getState'
        }
      });
      /* eslint-enable max-len */
    }
  }, {
    key: "draw",
    value: function draw(_ref) {
      var uniforms = _ref.uniforms;
      var sizeScale = this.props.sizeScale;
      var modelsByName = this.state.modelsByName;
      modelsByName.box.setUniforms(Object.assign({}, uniforms, {
        modelScale: [sizeScale * 0.8, sizeScale * 1.6, sizeScale * 1.6]
      })).draw();
      modelsByName.lights.setUniforms(Object.assign({}, uniforms, {
        modelScale: [sizeScale, sizeScale, sizeScale]
      })).draw();
    }
  }, {
    key: "_getModels",
    value: function _getModels(gl) {
      var shaders = this.getShaders();
      var box = new _core2.Model(gl, _objectSpread({
        id: "".concat(this.props.id, "-box")
      }, shaders, {
        shaderCache: this.context.shaderCache,
        geometry: new _core2.CubeGeometry(),
        isInstanced: true,
        uniforms: {
          modelTranslate: [0, 0, 0],
          useInstanceColor: false
        }
      }));
      var lights = new _core2.Model(gl, _objectSpread({
        id: "".concat(this.props.id, "-light")
      }, shaders, {
        shaderCache: this.context.shaderCache,
        geometry: new _core2.SphereGeometry(),
        isInstanced: true,
        uniforms: {
          lightShapeTexture: (0, _trafficLightUtils.makeLightShapeTexture)(gl),
          modelTranslate: [-0.4, 0, 0],
          useInstanceColor: true
        }
      }));
      return {
        box: box,
        lights: lights
      };
    }
  }, {
    key: "updateAttributes",
    value: function updateAttributes(props) {
      _get(_getPrototypeOf(TrafficLightLayer.prototype), "updateAttributes", this).call(this, props);

      var attributeManager = this.getAttributeManager();
      var changedAttributes = attributeManager.getChangedAttributes({
        clearChangedFlags: true
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.getModels()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var model = _step.value;
          model.setInstanceCount(this.props.data.length);
          model.setAttributes(changedAttributes);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "calculateInstancePositions64xyLow",
    value: function calculateInstancePositions64xyLow(attribute) {
      var isFP64 = this.use64bitPositions();
      attribute.constant = !isFP64;

      if (!isFP64) {
        attribute.value = new Float32Array(2);
        return;
      }

      var _this$props = this.props,
          data = _this$props.data,
          getPosition = _this$props.getPosition;
      var value = attribute.value;
      var i = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var point = _step2.value;
          var position = getPosition(point);
          value[i++] = fp64LowPart(position[0]);
          value[i++] = fp64LowPart(position[1]);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "calculateInstanceColors",
    value: function calculateInstanceColors(attribute) {
      var _this$props2 = this.props,
          data = _this$props2.data,
          getColor = _this$props2.getColor;
      var value = attribute.value;
      var i = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var point = _step3.value;
          var color = LIGHT_COLOR[getColor(point)] || LIGHT_COLOR.invalid;
          value[i++] = color[0];
          value[i++] = color[1];
          value[i++] = color[2];
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "calculateInstanceShapes",
    value: function calculateInstanceShapes(attribute) {
      var _this$props3 = this.props,
          data = _this$props3.data,
          getShape = _this$props3.getShape;
      var value = attribute.value;
      var i = 0;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var point = _step4.value;
          value[i++] = LIGHT_SHAPE[getShape(point)] || 0;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }]);

  return TrafficLightLayer;
}(_core.Layer);

exports["default"] = TrafficLightLayer;
TrafficLightLayer.layerName = 'TrafficLightLayer';
TrafficLightLayer.defaultProps = defaultProps;
//# sourceMappingURL=traffic-light-layer.js.map