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
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import ObjectLabelsOverlay from './object-labels-overlay';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { XVIZStyleParser } from '@xviz/parser';
import XVIZLayer from '../../layers/xviz-layer';
import { VIEW_MODE, DEFAULT_VIEW_STATE } from '../../constants';
import { getViewStateOffset, getViews, getViewStates } from '../../utils/viewport';
import { resolveCoordinateTransform } from '../../utils/transform';
import { mergeXVIZStyles } from '../../utils/style';
import { normalizeStreamFilter } from '../../utils/stream-utils';
import stats from '../../utils/stats';
import { DEFAULT_ORIGIN, CAR_DATA, LIGHTS, DEFAULT_CAR } from './constants';

const noop = () => {};

function getStreamMetadata(metadata, streamName) {
  return metadata && metadata.streams && metadata.streams[streamName] || {};
}

export default class Core3DViewer extends PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "_onMetrics", deckMetrics => {
      if (this.props.debug) {
        const metrics = {
          fps: deckMetrics.fps,
          redraw: deckMetrics.redraw || 0
        };
        const table = stats.getTable();

        for (const key in table) {
          metrics[key] = table[key].total;
        }

        this.props.debug(metrics);
      }

      stats.reset();
    });

    _defineProperty(this, "_onViewStateChange", (_ref) => {
      let viewState = _ref.viewState,
          oldViewState = _ref.oldViewState;
      const viewOffset = getViewStateOffset(oldViewState, viewState, this.props.viewOffset);
      this.props.onViewStateChange({
        viewState,
        viewOffset
      });
    });

    _defineProperty(this, "_onLayerHover", (info, evt) => {
      const objectId = info && info.object && info.object.id;
      this.isHovering = Boolean(objectId);
      this.props.onHover(info, evt);
    });

    _defineProperty(this, "_onLayerClick", (info, evt) => {
      const isRightClick = evt.which === 3;

      if (isRightClick) {
        this.props.onContextMenu(info, evt);
      } else {
        this.props.onClick(info, evt);
      }
    });

    _defineProperty(this, "_getCursor", () => {
      return this.isHovering ? 'pointer' : 'crosshair';
    });

    this.state = {
      styleParser: this._getStyleParser(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.viewMode !== nextProps.viewMode) {
      const viewState = _objectSpread({}, this.props.viewState, DEFAULT_VIEW_STATE, nextProps.viewMode.initialViewState); // Reset offset


      const viewOffset = {
        x: 0,
        y: 0,
        bearing: 0
      };
      nextProps.onViewStateChange({
        viewState,
        viewOffset
      });
    }

    if (this.props.metadata !== nextProps.metadata || this.props.xvizStyles !== nextProps.xvizStyles) {
      this.setState({
        styleParser: this._getStyleParser(nextProps)
      });
    }

    if (this.props.frame !== nextProps.frame) {
      stats.get('frame-update').incrementCount();
    }
  }

  _getStyleParser(_ref2) {
    let metadata = _ref2.metadata,
        xvizStyles = _ref2.xvizStyles;
    return new XVIZStyleParser(mergeXVIZStyles(metadata && metadata.styles, xvizStyles));
  }

  _getCarLayer() {
    const _this$props = this.props,
          frame = _this$props.frame,
          car = _this$props.car;
    const _car$origin = car.origin,
          origin = _car$origin === void 0 ? DEFAULT_ORIGIN : _car$origin,
          mesh = car.mesh,
          _car$scale = car.scale,
          scale = _car$scale === void 0 ? [1, 1, 1] : _car$scale,
          _car$wireframe = car.wireframe,
          wireframe = _car$wireframe === void 0 ? false : _car$wireframe,
          _car$texture = car.texture,
          texture = _car$texture === void 0 ? null : _car$texture,
          _car$color = car.color,
          color = _car$color === void 0 ? [0, 0, 0] : _car$color;
    return new SimpleMeshLayer({
      id: 'car',
      opacity: 1,
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      coordinateOrigin: frame.origin || DEFAULT_ORIGIN,
      // Adjust for car center position relative to GPS/IMU
      getTransformMatrix: d => frame.vehicleRelativeTransform.clone().translate(origin).scale(scale),
      mesh,
      data: CAR_DATA,
      getPosition: d => d,
      getColor: color,
      texture,
      wireframe,
      updateTriggers: {
        getTransformMatrix: frame.vehicleRelativeTransform
      }
    });
  }

  _getLayers() {
    const _this$props2 = this.props,
          frame = _this$props2.frame,
          metadata = _this$props2.metadata,
          showTooltip = _this$props2.showTooltip,
          objectStates = _this$props2.objectStates,
          customLayers = _this$props2.customLayers,
          getTransformMatrix = _this$props2.getTransformMatrix;

    if (!frame || !metadata) {
      return [];
    }

    const streams = frame.streams,
          _frame$lookAheads = frame.lookAheads,
          lookAheads = _frame$lookAheads === void 0 ? {} : _frame$lookAheads;
    const styleParser = this.state.styleParser;
    const streamFilter = normalizeStreamFilter(this.props.streamFilter);
    const featuresAndFutures = new Set(Object.keys(streams).concat(Object.keys(lookAheads)).filter(streamFilter));
    return [this._getCarLayer(), Array.from(featuresAndFutures).map(streamName => {
      // Check lookAheads first because it will contain the selected futures
      // while streams would contain the full futures array
      const stream = lookAheads[streamName] || streams[streamName];
      const streamMetadata = getStreamMetadata(metadata, streamName);
      const coordinateProps = resolveCoordinateTransform(frame, streamMetadata, getTransformMatrix);
      const stylesheet = styleParser.getStylesheet(streamName); // Support both features and lookAheads, respectively

      const primitives = stream.features || stream;

      if (primitives && primitives.length) {
        return new XVIZLayer(_objectSpread({
          id: "xviz-".concat(streamName)
        }, coordinateProps, {
          pickable: showTooltip || primitives[0].id,
          data: primitives,
          style: stylesheet,
          objectStates,
          // Hack: draw extruded polygons last to defeat depth test when rendering translucent objects
          // This is not used by deck.gl, only used in this function to sort the layers
          zIndex: primitives[0].type === 'polygon' ? 2 : 0,
          // Selection props (app defined, not used by deck.gl)
          streamName
        }));
      }

      if (stream.pointCloud) {
        return new XVIZLayer(_objectSpread({
          id: "xviz-".concat(streamName)
        }, coordinateProps, {
          pickable: showTooltip,
          data: stream.pointCloud,
          style: stylesheet,
          vehicleRelativeTransform: frame.vehicleRelativeTransform,
          // Hack: draw point clouds before polygons to defeat depth test when rendering translucent objects
          // This is not used by deck.gl, only used in this function to sort the layers
          zIndex: 1,
          streamName
        }));
      }

      return null;
    }).filter(Boolean).sort((layer1, layer2) => layer1.props.zIndex - layer2.props.zIndex), customLayers.map(layer => {
      // Clone layer props
      const props = layer.props;
      const additionalProps = {};

      if (props.streamName) {
        // Use log data
        const stream = streams[props.streamName];
        const streamMetadata = getStreamMetadata(metadata, props.streamName);
        Object.assign(additionalProps, resolveCoordinateTransform(frame, streamMetadata, getTransformMatrix), {
          data: stream && stream.features
        });
      } else if (props.coordinate) {
        // Apply log-specific coordinate props
        Object.assign(additionalProps, resolveCoordinateTransform(frame, props, getTransformMatrix));
      } else {
        return layer;
      }

      return layer.clone(additionalProps);
    })];
  }

  _layerFilter(_ref3) {
    let layer = _ref3.layer,
        viewport = _ref3.viewport,
        isPicking = _ref3.isPicking;

    if (viewport.id === 'driver') {
      return layer.id !== 'car';
    }

    return true;
  }

  _getViewState() {
    const _this$props3 = this.props,
          viewMode = _this$props3.viewMode,
          frame = _this$props3.frame,
          viewState = _this$props3.viewState,
          viewOffset = _this$props3.viewOffset;
    const trackedPosition = frame ? {
      longitude: frame.trackPosition[0],
      latitude: frame.trackPosition[1],
      bearing: 90 - frame.heading
    } : null;
    return getViewStates({
      viewState,
      viewMode,
      trackedPosition,
      offset: viewOffset
    });
  }

  render() {
    const _this$props4 = this.props,
          mapboxApiAccessToken = _this$props4.mapboxApiAccessToken,
          frame = _this$props4.frame,
          metadata = _this$props4.metadata,
          objectStates = _this$props4.objectStates,
          renderObjectLabel = _this$props4.renderObjectLabel,
          getTransformMatrix = _this$props4.getTransformMatrix,
          style = _this$props4.style,
          mapStyle = _this$props4.mapStyle,
          viewMode = _this$props4.viewMode,
          showMap = _this$props4.showMap;
    const styleParser = this.state.styleParser;
    return React.createElement(DeckGL, {
      width: "100%",
      height: "100%",
      effects: [LIGHTS],
      views: getViews(viewMode),
      viewState: this._getViewState(),
      layers: this._getLayers(),
      layerFilter: this._layerFilter,
      getCursor: this._getCursor,
      onHover: this._onLayerHover,
      onClick: this._onLayerClick,
      onViewStateChange: this._onViewStateChange,
      _onMetrics: this._onMetrics
    }, showMap && React.createElement(StaticMap, {
      reuseMap: true,
      attributionControl: false,
      mapboxApiAccessToken: mapboxApiAccessToken,
      mapStyle: mapStyle,
      visible: frame && frame.origin && !viewMode.firstPerson
    }), React.createElement(ObjectLabelsOverlay, {
      objectSelection: objectStates.selected,
      frame: frame,
      metadata: metadata,
      renderObjectLabel: renderObjectLabel,
      xvizStyleParser: styleParser,
      style: style,
      getTransformMatrix: getTransformMatrix
    }), this.props.children);
  }

}

_defineProperty(Core3DViewer, "propTypes", {
  // Props from loader
  frame: PropTypes.object,
  metadata: PropTypes.object,
  // Rendering options
  showMap: PropTypes.bool,
  showTooltip: PropTypes.bool,
  mapboxApiAccessToken: PropTypes.string,
  mapStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  xvizStyles: PropTypes.object,
  car: PropTypes.object,
  viewMode: PropTypes.object,
  streamFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object, PropTypes.func]),
  customLayers: PropTypes.array,
  renderObjectLabel: PropTypes.func,
  getTransformMatrix: PropTypes.func,
  // Callbacks
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  onViewStateChange: PropTypes.func,
  // Debug info listener
  debug: PropTypes.func,
  // States
  viewState: PropTypes.object,
  viewOffset: PropTypes.object,
  objectStates: PropTypes.object
});

_defineProperty(Core3DViewer, "defaultProps", {
  car: DEFAULT_CAR,
  viewMode: VIEW_MODE.PERSPECTIVE,
  xvizStyles: {},
  customLayers: [],
  onViewStateChange: noop,
  onHover: noop,
  onClick: noop,
  onContextMenu: noop,
  showMap: true,
  showTooltip: false
});
//# sourceMappingURL=core-3d-viewer.js.map