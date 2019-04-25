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

/* eslint-disable camelcase */
import { CompositeLayer } from '@deck.gl/core';
import { ScatterplotLayer, PathLayer, PolygonLayer, TextLayer } from '@deck.gl/layers';
import PointCloudLayer from './point-cloud-layer/point-cloud-layer'; // TODO/ib - Uncomment to enable binary/flat polygon arrays
// import PathLayer from './binary-path-layer/binary-path-layer';
// import PolygonLayer from './binary-polygon-layer/binary-polygon-layer';

import { XVIZObject } from '@xviz/parser';
import deepExtend from 'lodash.merge';
const XVIZ_TO_LAYER_TYPE = {
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
const STYLE_TO_LAYER_PROP = {
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
const EMPTY_OBJECT = {}; // Access V1 style properties

const getInlineProperty = (context, propertyName, objectState) => {
  const inlineProp = objectState[propertyName];
  return inlineProp === undefined ? null : inlineProp;
};

const getStylesheetProperty = (context, propertyName, objectState) => context.style.getProperty(propertyName, objectState); // Fetch layer property from XVIZ Stylesheet or object
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
  let f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT;
  let objectState = f; // Handle XVIZ v1 color override where our semantic color mapping
  // differs from current OCS colors.  In XVIZ v2 we should be aligned.

  if (context.useSemanticColor) {
    switch (propertyName) {
      case 'stroke_color':
      case 'fill_color':
        objectState = XVIZObject.get(f.id) || f;
        break;

      default: // ignore

    }
  } // Handle XVIZ v1 style property name mismatches and
  // setup validation function based on property name.


  let altPropertyName = null;

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


  let property = getStylesheetProperty(context, propertyName, objectState); // 1b. Alt property from inline style (v2) or stylesheet

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


export default class XVIZLayer extends CompositeLayer {
  _getProperty(propertyName) {
    return getProperty(this.props, propertyName);
  }

  _getPropertyAccessor(propertyName) {
    return f => getProperty(this.props, propertyName, f);
  } // These props are persistent unless data type and stylesheet change


  _getDefaultLayerProps(style, styleToLayerProp) {
    const layerProps = {
      updateTriggers: {}
    };

    for (const stylePropName in styleToLayerProp) {
      const layerPropName = styleToLayerProp[stylePropName];
      const isAccessor = layerPropName.startsWith('get');

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

  _getLayerProps() {
    const objectStates = this.props.objectStates;
    const layerProps = this.state.layerProps;
    const updateTriggers = layerProps.updateTriggers;

    for (const key in updateTriggers) {
      const trigger = updateTriggers[key];
      layerProps[key] = this._getPropertyAccessor(trigger.style);
      updateTriggers[key] = _objectSpread({}, trigger);
      trigger.dependencies.forEach(stateName => {
        updateTriggers[key][stateName] = objectStates[stateName];
      });
    }

    return layerProps;
  }

  _getLayerType(data) {
    if (data.length > 0) {
      return data[0].type;
    }

    return data.type;
  }

  updateState(_ref) {
    let props = _ref.props,
        oldProps = _ref.oldProps,
        changeFlags = _ref.changeFlags;
    let type = this.state.type;

    if (changeFlags.dataChanged) {
      // Pre-process data
      let data = props.data;

      const dataType = this._getLayerType(data);

      type = XVIZ_TO_LAYER_TYPE[dataType];

      if (type === 'scatterplot' && data[0].vertices && Array.isArray(data[0].vertices[0])) {
        // is multi point
        data = data.reduce((arr, multiPoints) => {
          multiPoints.vertices.forEach(pt => {
            arr.push(_objectSpread({}, multiPoints, {
              vertices: pt
            }));
          });
          return arr;
        }, []);
      }

      this.setState({
        data
      });
    }

    if (type !== this.state.type || props.style !== oldProps.style) {
      const styleToLayerProp = STYLE_TO_LAYER_PROP[type];

      const layerProps = this._getDefaultLayerProps(props.style, styleToLayerProp);

      this.setState({
        type,
        layerProps
      });
    }
  }

  renderLayers() {
    const lightSettings = this.props.lightSettings;
    const _this$state = this.state,
          type = _this$state.type,
          data = _this$state.data;

    if (!type) {
      return null;
    }

    const _this$props = this.props,
          linkTitle = _this$props.linkTitle,
          streamName = _this$props.streamName,
          objectType = _this$props.objectType;

    const layerProps = this._getLayerProps();

    const updateTriggers = layerProps.updateTriggers;
    const forwardProps = {
      linkTitle,
      streamName,
      objectType
    };

    switch (type) {
      case 'scatterplot':
        return new ScatterplotLayer(forwardProps, layerProps, this.getSubLayerProps({
          id: 'scatterplot',
          data,
          // `vertices` is used xviz V1 and `center` is used by xviz V2
          getPosition: f => f.vertices || f.center,
          updateTriggers: deepExtend(updateTriggers, {
            getFillColor: {
              useSemanticColor: this.props.useSemanticColor
            }
          })
        }));

      case 'pointcloud':
        return new PointCloudLayer(forwardProps, layerProps, Array.isArray(data) ? {
          data: data[0].vertices
        } : {
          data: data.ids,
          numInstances: data.numInstances,
          instancePositions: data.positions,
          instanceColors: data.colors
        }, this.getSubLayerProps({
          id: 'pointcloud',
          vehicleRelativeTransform: this.props.vehicleRelativeTransform,
          getPosition: p => p
        }));

      case 'path':
        return new PathLayer(forwardProps, layerProps, this.getSubLayerProps({
          id: 'path',
          data,
          getPath: f => f.vertices,
          updateTriggers: deepExtend(updateTriggers, {
            getColor: {
              useSemanticColor: this.props.useSemanticColor
            }
          })
        }));

      case 'stadium':
        return new PathLayer(forwardProps, layerProps, this.getSubLayerProps({
          id: 'stadium',
          data,
          getPath: f => [f.start, f.end],
          rounded: true,
          updateTriggers: deepExtend(updateTriggers, {
            getColor: {
              useSemanticColor: this.props.useSemanticColor
            }
          })
        }));

      case 'polygon':
        return new PolygonLayer(forwardProps, layerProps, this.getSubLayerProps({
          id: 'polygon',
          opacity: this.props.opacity || 1,
          data,
          lightSettings,
          wireframe: layerProps.stroked,
          getPolygon: f => f.vertices,
          updateTriggers: deepExtend(updateTriggers, {
            getLineColor: {
              useSemanticColor: this.props.useSemanticColor
            },
            getFillColor: {
              useSemanticColor: this.props.useSemanticColor
            }
          })
        }));

      case 'text':
        return new TextLayer(forwardProps, layerProps, this.getSubLayerProps({
          id: 'text',
          data,
          getText: f => f.text,
          updateTriggers: deepExtend(updateTriggers, {
            getColor: {
              useSemanticColor: this.props.useSemanticColor
            }
          })
        }));

      default:
        return null;
    }
  }

}
XVIZLayer.layerName = 'XVIZLayer';
//# sourceMappingURL=xviz-layer.js.map