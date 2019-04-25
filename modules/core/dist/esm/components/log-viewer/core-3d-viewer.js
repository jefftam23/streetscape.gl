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
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

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

var noop = function noop() {};

function getStreamMetadata(metadata, streamName) {
  return metadata && metadata.streams && metadata.streams[streamName] || {};
}

var Core3DViewer =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Core3DViewer, _PureComponent);

  function Core3DViewer(props) {
    var _this;

    _classCallCheck(this, Core3DViewer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Core3DViewer).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onMetrics", function (deckMetrics) {
      if (_this.props.debug) {
        var metrics = {
          fps: deckMetrics.fps,
          redraw: deckMetrics.redraw || 0
        };
        var table = stats.getTable();

        for (var key in table) {
          metrics[key] = table[key].total;
        }

        _this.props.debug(metrics);
      }

      stats.reset();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onViewStateChange", function (_ref) {
      var viewState = _ref.viewState,
          oldViewState = _ref.oldViewState;
      var viewOffset = getViewStateOffset(oldViewState, viewState, _this.props.viewOffset);

      _this.props.onViewStateChange({
        viewState: viewState,
        viewOffset: viewOffset
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onLayerHover", function (info, evt) {
      var objectId = info && info.object && info.object.id;
      _this.isHovering = Boolean(objectId);

      _this.props.onHover(info, evt);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onLayerClick", function (info, evt) {
      var isRightClick = evt.which === 3;

      if (isRightClick) {
        _this.props.onContextMenu(info, evt);
      } else {
        _this.props.onClick(info, evt);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getCursor", function () {
      return _this.isHovering ? 'pointer' : 'crosshair';
    });

    _this.state = {
      styleParser: _this._getStyleParser(props)
    };
    return _this;
  }

  _createClass(Core3DViewer, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.viewMode !== nextProps.viewMode) {
        var viewState = _objectSpread({}, this.props.viewState, DEFAULT_VIEW_STATE, nextProps.viewMode.initialViewState); // Reset offset


        var viewOffset = {
          x: 0,
          y: 0,
          bearing: 0
        };
        nextProps.onViewStateChange({
          viewState: viewState,
          viewOffset: viewOffset
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
  }, {
    key: "_getStyleParser",
    value: function _getStyleParser(_ref2) {
      var metadata = _ref2.metadata,
          xvizStyles = _ref2.xvizStyles;
      return new XVIZStyleParser(mergeXVIZStyles(metadata && metadata.styles, xvizStyles));
    }
  }, {
    key: "_getCarLayer",
    value: function _getCarLayer() {
      var _this$props = this.props,
          frame = _this$props.frame,
          car = _this$props.car;
      var _car$origin = car.origin,
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
        getTransformMatrix: function getTransformMatrix(d) {
          return frame.vehicleRelativeTransform.clone().translate(origin).scale(scale);
        },
        mesh: mesh,
        data: CAR_DATA,
        getPosition: function getPosition(d) {
          return d;
        },
        getColor: color,
        texture: texture,
        wireframe: wireframe,
        updateTriggers: {
          getTransformMatrix: frame.vehicleRelativeTransform
        }
      });
    }
  }, {
    key: "_getLayers",
    value: function _getLayers() {
      var _this$props2 = this.props,
          frame = _this$props2.frame,
          metadata = _this$props2.metadata,
          showTooltip = _this$props2.showTooltip,
          objectStates = _this$props2.objectStates,
          customLayers = _this$props2.customLayers,
          getTransformMatrix = _this$props2.getTransformMatrix;

      if (!frame || !metadata) {
        return [];
      }

      var streams = frame.streams,
          _frame$lookAheads = frame.lookAheads,
          lookAheads = _frame$lookAheads === void 0 ? {} : _frame$lookAheads;
      var styleParser = this.state.styleParser;
      var streamFilter = normalizeStreamFilter(this.props.streamFilter);
      var featuresAndFutures = new Set(Object.keys(streams).concat(Object.keys(lookAheads)).filter(streamFilter));
      return [this._getCarLayer(), Array.from(featuresAndFutures).map(function (streamName) {
        // Check lookAheads first because it will contain the selected futures
        // while streams would contain the full futures array
        var stream = lookAheads[streamName] || streams[streamName];
        var streamMetadata = getStreamMetadata(metadata, streamName);
        var coordinateProps = resolveCoordinateTransform(frame, streamMetadata, getTransformMatrix);
        var stylesheet = styleParser.getStylesheet(streamName); // Support both features and lookAheads, respectively

        var primitives = stream.features || stream;

        if (primitives && primitives.length) {
          return new XVIZLayer(_objectSpread({
            id: "xviz-".concat(streamName)
          }, coordinateProps, {
            pickable: showTooltip || primitives[0].id,
            data: primitives,
            style: stylesheet,
            objectStates: objectStates,
            // Hack: draw extruded polygons last to defeat depth test when rendering translucent objects
            // This is not used by deck.gl, only used in this function to sort the layers
            zIndex: primitives[0].type === 'polygon' ? 2 : 0,
            // Selection props (app defined, not used by deck.gl)
            streamName: streamName
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
            streamName: streamName
          }));
        }

        return null;
      }).filter(Boolean).sort(function (layer1, layer2) {
        return layer1.props.zIndex - layer2.props.zIndex;
      }), customLayers.map(function (layer) {
        // Clone layer props
        var props = layer.props;
        var additionalProps = {};

        if (props.streamName) {
          // Use log data
          var stream = streams[props.streamName];
          var streamMetadata = getStreamMetadata(metadata, props.streamName);
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
  }, {
    key: "_layerFilter",
    value: function _layerFilter(_ref3) {
      var layer = _ref3.layer,
          viewport = _ref3.viewport,
          isPicking = _ref3.isPicking;

      if (viewport.id === 'driver') {
        return layer.id !== 'car';
      }

      return true;
    }
  }, {
    key: "_getViewState",
    value: function _getViewState() {
      var _this$props3 = this.props,
          viewMode = _this$props3.viewMode,
          frame = _this$props3.frame,
          viewState = _this$props3.viewState,
          viewOffset = _this$props3.viewOffset;
      var trackedPosition = frame ? {
        longitude: frame.trackPosition[0],
        latitude: frame.trackPosition[1],
        bearing: 90 - frame.heading
      } : null;
      return getViewStates({
        viewState: viewState,
        viewMode: viewMode,
        trackedPosition: trackedPosition,
        offset: viewOffset
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
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
      var styleParser = this.state.styleParser;
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
  }]);

  return Core3DViewer;
}(PureComponent);

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

export { Core3DViewer as default };
//# sourceMappingURL=core-3d-viewer.js.map