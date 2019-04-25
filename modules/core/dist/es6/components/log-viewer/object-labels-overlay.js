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
import { _MapContext as MapContext } from 'react-map-gl';
import PerspectivePopup from './perspective-popup';
import { resolveCoordinateTransform, positionToLngLat } from '../../utils/transform';

const renderDefaultObjectLabel = ({
  id,
  isSelected
}) => isSelected && React.createElement("div", null, "ID: ", id);

export default class ObjectLabelsOverlay extends PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "_renderPerspectivePopup", object => {
      const _this$props = this.props,
            objectSelection = _this$props.objectSelection,
            frame = _this$props.frame,
            xvizStyleParser = _this$props.xvizStyleParser,
            style = _this$props.style,
            renderObjectLabel = _this$props.renderObjectLabel;
      const isSelected = Boolean(objectSelection[object.id]);
      const styleProps = {
        id: object.id,
        isSelected,
        object,
        xvizStyles: xvizStyleParser
      };
      const labelContent = renderObjectLabel(styleProps);

      if (!labelContent) {
        return null;
      }

      let trackingPoint;
      let objectHeight;

      for (const streamName of object.streamNames) {
        const feature = object.getFeature(streamName);

        if (!trackingPoint && (feature.center || feature.vertices)) {
          trackingPoint = positionToLngLat(object.position, this._getCoordinateProps(streamName));
        }

        if (!objectHeight && feature.vertices) {
          objectHeight = xvizStyleParser.getStylesheet(streamName).getProperty('height', feature);
        }
      }

      trackingPoint[2] += objectHeight || 0; // compensate for camera offset

      if (frame.origin) {
        trackingPoint[2] -= frame.origin[2];
      }

      return React.createElement(PerspectivePopup, {
        key: object.id,
        longitude: trackingPoint[0],
        latitude: trackingPoint[1],
        altitude: trackingPoint[2],
        anchor: "bottom-left",
        dynamicPosition: true,
        styleProps: styleProps,
        style: style,
        sortByDepth: true,
        closeButton: false,
        closeOnClick: false
      }, labelContent);
    });

    this.state = {
      coordinateProps: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    const frame = nextProps.frame;

    if (frame && frame !== this.props.frame) {
      this.setState({
        coordinateProps: {}
      });
    }
  }

  _getCoordinateProps(streamName) {
    const coordinateProps = this.state.coordinateProps;
    let result = coordinateProps[streamName];

    if (result) {
      return result;
    }

    const _this$props2 = this.props,
          frame = _this$props2.frame,
          metadata = _this$props2.metadata,
          getTransformMatrix = _this$props2.getTransformMatrix;
    const streamMetadata = metadata.streams && metadata.streams[streamName];
    result = resolveCoordinateTransform(frame, streamMetadata, getTransformMatrix); // cache calculated coordinate props by stream name

    coordinateProps[streamName] = result;
    return result;
  }

  render() {
    const _this$props3 = this.props,
          frame = _this$props3.frame,
          viewport = _this$props3.viewport,
          renderObjectLabel = _this$props3.renderObjectLabel;

    if (!frame || !renderObjectLabel) {
      return null;
    }

    return React.createElement(MapContext.Provider, {
      value: {
        viewport
      }
    }, Object.values(frame.objects).map(this._renderPerspectivePopup));
  }

}

_defineProperty(ObjectLabelsOverlay, "propTypes", {
  objectSelection: PropTypes.object,
  frame: PropTypes.object,
  metadata: PropTypes.object,
  xvizStyleParser: PropTypes.object,
  renderObjectLabel: PropTypes.func,
  style: PropTypes.object,
  getTransformMatrix: PropTypes.func
});

_defineProperty(ObjectLabelsOverlay, "defaultProps", {
  objectSelection: {},
  renderObjectLabel: renderDefaultObjectLabel,
  style: {}
});
//# sourceMappingURL=object-labels-overlay.js.map