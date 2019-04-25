"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

var _pointCloudLayer = _interopRequireDefault(require("./point-cloud-layer/point-cloud-layer"));

var _parser = require("@xviz/parser");

var _lodash = _interopRequireDefault(require("lodash.merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var XVIZ_TO_LAYER_TYPE = {
  // V1
  points2d: 'scatterplot',
  points3d: 'pointcloud',
  point2d: 'scatterplot',
  circle2d: 'scatterplot',
  line2d: 'path',
  path2d: 'path',
  polygon2d: 'polygon',
  // V2
  point: 'pointcloud',
  circle: 'scatterplot',
  polyline: 'path',
  polygon: 'polygon',
  text: 'text',
  stadium: 'stadium'
};
var STYLE_TO_LAYER_PROP = {
  scatterplot: {
    opacity: 'opacity',
    radius_min_pixels: 'radiusMinPixels',
    radius_max_pixels: 'radiusMaxPixels',
    radius: 'getRadius',
    stroked: 'stroked',
    filled: 'filled',
    stroke_width_min_pixels: 'widthMinPixels',
    stroke_width_max_pixels: 'widthMaxPixels',
    stroke_width: 'getLineWidth',
    stroke_color: 'getLineColor',
    fill_color: 'getFillColor'
  },
  pointcloud: {
    opacity: 'opacity',
    radius_pixels: 'pointSize',
    fill_color: 'getColor',
    point_color_mode: 'colorMode',
    point_color_domain: 'colorDomain'
  },
  path: {
    opacity: 'opacity',
    stroke_width_min_pixels: 'widthMinPixels',
    stroke_width_max_pixels: 'widthMaxPixels',
    stroke_color: 'getColor',
    stroke_width: 'getWidth'
  },
  stadium: {
    opacity: 'opacity',
    radius_min_pixels: 'widthMinPixels',
    radius_max_pixels: 'widthMaxPixels',
    fill_color: 'getColor',
    radius: 'getWidth'
  },
  polygon: {
    opacity: 'opacity',
    stroked: 'stroked',
    filled: 'filled',
    extruded: 'extruded',
    stroke_color: 'getLineColor',
    stroke_width: 'getLineWidth',
    stroke_width_min_pixels: 'lineWidthMinPixels',
    stroke_width_max_pixels: 'lineWidthMaxPixels',
    fill_color: 'getFillColor',
    height: 'getElevation'
  },
  text: {
    opacity: 'opacity',
    fill_color: 'getColor',
    font_family: 'fontFamily',
    font_weight: 'fontWeight',
    text_size: 'getSize',
    text_rotation: 'getAngle',
    text_anchor: 'getTextAnchor',
    text_baseline: 'getAlignmentBaseline'
  }
};
var EMPTY_OBJECT = {}; // Access V1 style properties

var getInlineProperty = function getInlineProperty(context, propertyName, objectState) {
  var inlineProp = objectState[propertyName];
  return inlineProp === undefined ? null : inlineProp;
};

var getStylesheetProperty = function getStylesheetProperty(context, propertyName, objectState) {
  return context.style.getProperty(propertyName, objectState);
}; // Fetch layer property from XVIZ Stylesheet or object
//
// Current resolution of property to style attribute has to deal with
//  - stylesheets taking precedence over inline style attributes
//  - style attribute names used in the application do not match those of
//    XVIZ v1
//
// TODO(twojtasz): Once XVIZ v1 is removed this logic can be simplified
// by removing the `altPropertyName` and changing the order of resolution
// to be inline, stylesheet, then default.
//

/* eslint-disable complexity */


function getProperty(context, propertyName) {
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT;
  var objectState = f; // Handle XVIZ v1 color override where our semantic color mapping
  // differs from current OCS colors.  In XVIZ v2 we should be aligned.

  if (context.useSemanticColor) {
    switch (propertyName) {
      case 'stroke_color':
      case 'fill_color':
        objectState = _parser.XVIZObject.get(f.id) || f;
        break;

      default: // ignore

    }
  } // Handle XVIZ v1 style property name mismatches and
  // setup validation function based on property name.


  var altPropertyName = null;

  switch (propertyName) {
    case 'stroke_color':
    case 'fill_color':
      altPropertyName = 'color';
      break;

    case 'stroke_width':
      altPropertyName = 'thickness';
      break;

    case 'radius':
      // v2 circle inline style
      if (f.radius) {
        return f.radius;
      }

      break;

    default:
      break;
  } // 1a. Property from inline style (v2) or stylesheet


  var property = getStylesheetProperty(context, propertyName, objectState); // 1b. Alt property from inline style (v2) or stylesheet

  if (property === null && altPropertyName) {
    property = getStylesheetProperty(context, altPropertyName, objectState);
  } // Backward compatibility


  if (property === null && !context.disableInlineStyling) {
    // 2a. Property from inline style (v1)
    property = getInlineProperty(context, propertyName, objectState); // 2b. Alt property from inline style (v1)

    if (property === null && altPropertyName) {
      property = getInlineProperty(context, altPropertyName, objectState);
    }
  } // 3. Property from default style


  if (property === null) {
    property = context.style.getPropertyDefault(propertyName);
  }

  return property;
}
/* eslint-enable complexity */


var XVIZLayer =
/*#__PURE__*/
function (_CompositeLayer) {
  _inherits(XVIZLayer, _CompositeLayer);

  function XVIZLayer() {
    _classCallCheck(this, XVIZLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(XVIZLayer).apply(this, arguments));
  }

  _createClass(XVIZLayer, [{
    key: "_getProperty",
    value: function _getProperty(propertyName) {
      return getProperty(this.props, propertyName);
    }
  }, {
    key: "_getPropertyAccessor",
    value: function _getPropertyAccessor(propertyName) {
      var _this = this;

      return function (f) {
        return getProperty(_this.props, propertyName, f);
      };
    } // These props are persistent unless data type and stylesheet change

  }, {
    key: "_getDefaultLayerProps",
    value: function _getDefaultLayerProps(style, styleToLayerProp) {
      var layerProps = {
        updateTriggers: {}
      };

      for (var stylePropName in styleToLayerProp) {
        var layerPropName = styleToLayerProp[stylePropName];
        var isAccessor = layerPropName.startsWith('get');

        if (isAccessor) {
          layerProps.updateTriggers[layerPropName] = {
            style: stylePropName,
            dependencies: style.getPropertyDependencies(stylePropName)
          };
        } else {
          layerProps[layerPropName] = this._getProperty(stylePropName);
        }
      }

      return layerProps;
    }
  }, {
    key: "_getLayerProps",
    value: function _getLayerProps() {
      var _this2 = this;

      var objectStates = this.props.objectStates;
      var layerProps = this.state.layerProps;
      var updateTriggers = layerProps.updateTriggers;

      var _loop = function _loop(key) {
        var trigger = updateTriggers[key];
        layerProps[key] = _this2._getPropertyAccessor(trigger.style);
        updateTriggers[key] = _objectSpread({}, trigger);
        trigger.dependencies.forEach(function (stateName) {
          updateTriggers[key][stateName] = objectStates[stateName];
        });
      };

      for (var key in updateTriggers) {
        _loop(key);
      }

      return layerProps;
    }
  }, {
    key: "_getLayerType",
    value: function _getLayerType(data) {
      if (data.length > 0) {
        return data[0].type;
      }

      return data.type;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;
      var type = this.state.type;

      if (changeFlags.dataChanged) {
        // Pre-process data
        var data = props.data;

        var dataType = this._getLayerType(data);

        type = XVIZ_TO_LAYER_TYPE[dataType];

        if (type === 'scatterplot' && data[0].vertices && Array.isArray(data[0].vertices[0])) {
          // is multi point
          data = data.reduce(function (arr, multiPoints) {
            multiPoints.vertices.forEach(function (pt) {
              arr.push(_objectSpread({}, multiPoints, {
                vertices: pt
              }));
            });
            return arr;
          }, []);
        }

        this.setState({
          data: data
        });
      }

      if (type !== this.state.type || props.style !== oldProps.style) {
        var styleToLayerProp = STYLE_TO_LAYER_PROP[type];

        var layerProps = this._getDefaultLayerProps(props.style, styleToLayerProp);

        this.setState({
          type: type,
          layerProps: layerProps
        });
      }
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var lightSettings = this.props.lightSettings;
      var _this$state = this.state,
          type = _this$state.type,
          data = _this$state.data;

      if (!type) {
        return null;
      }

      var _this$props = this.props,
          linkTitle = _this$props.linkTitle,
          streamName = _this$props.streamName,
          objectType = _this$props.objectType;

      var layerProps = this._getLayerProps();

      var updateTriggers = layerProps.updateTriggers;
      var forwardProps = {
        linkTitle: linkTitle,
        streamName: streamName,
        objectType: objectType
      };

      switch (type) {
        case 'scatterplot':
          return new _layers.ScatterplotLayer(forwardProps, layerProps, this.getSubLayerProps({
            id: 'scatterplot',
            data: data,
            // `vertices` is used xviz V1 and `center` is used by xviz V2
            getPosition: function getPosition(f) {
              return f.vertices || f.center;
            },
            updateTriggers: (0, _lodash["default"])(updateTriggers, {
              getFillColor: {
                useSemanticColor: this.props.useSemanticColor
              }
            })
          }));

        case 'pointcloud':
          return new _pointCloudLayer["default"](forwardProps, layerProps, Array.isArray(data) ? {
            data: data[0].vertices
          } : {
            data: data.ids,
            numInstances: data.numInstances,
            instancePositions: data.positions,
            instanceColors: data.colors
          }, this.getSubLayerProps({
            id: 'pointcloud',
            vehicleRelativeTransform: this.props.vehicleRelativeTransform,
            getPosition: function getPosition(p) {
              return p;
            }
          }));

        case 'path':
          return new _layers.PathLayer(forwardProps, layerProps, this.getSubLayerProps({
            id: 'path',
            data: data,
            getPath: function getPath(f) {
              return f.vertices;
            },
            updateTriggers: (0, _lodash["default"])(updateTriggers, {
              getColor: {
                useSemanticColor: this.props.useSemanticColor
              }
            })
          }));

        case 'stadium':
          return new _layers.PathLayer(forwardProps, layerProps, this.getSubLayerProps({
            id: 'stadium',
            data: data,
            getPath: function getPath(f) {
              return [f.start, f.end];
            },
            rounded: true,
            updateTriggers: (0, _lodash["default"])(updateTriggers, {
              getColor: {
                useSemanticColor: this.props.useSemanticColor
              }
            })
          }));

        case 'polygon':
          return new _layers.PolygonLayer(forwardProps, layerProps, this.getSubLayerProps({
            id: 'polygon',
            opacity: this.props.opacity || 1,
            data: data,
            lightSettings: lightSettings,
            wireframe: layerProps.stroked,
            getPolygon: function getPolygon(f) {
              return f.vertices;
            },
            updateTriggers: (0, _lodash["default"])(updateTriggers, {
              getLineColor: {
                useSemanticColor: this.props.useSemanticColor
              },
              getFillColor: {
                useSemanticColor: this.props.useSemanticColor
              }
            })
          }));

        case 'text':
          return new _layers.TextLayer(forwardProps, layerProps, this.getSubLayerProps({
            id: 'text',
            data: data,
            getText: function getText(f) {
              return f.text;
            },
            updateTriggers: (0, _lodash["default"])(updateTriggers, {
              getColor: {
                useSemanticColor: this.props.useSemanticColor
              }
            })
          }));

        default:
          return null;
      }
    }
  }]);

  return XVIZLayer;
}(_core.CompositeLayer);

exports["default"] = XVIZLayer;
XVIZLayer.layerName = 'XVIZLayer';
//# sourceMappingURL=xviz-layer.js.map