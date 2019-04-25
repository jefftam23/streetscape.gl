function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
import { _MapContext as MapContext } from 'react-map-gl';
import PerspectivePopup from './perspective-popup';
import { resolveCoordinateTransform, positionToLngLat } from '../../utils/transform';

var renderDefaultObjectLabel = function renderDefaultObjectLabel(_ref) {
  var id = _ref.id,
      isSelected = _ref.isSelected;
  return isSelected && React.createElement("div", null, "ID: ", id);
};

var ObjectLabelsOverlay =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ObjectLabelsOverlay, _PureComponent);

  function ObjectLabelsOverlay(props) {
    var _this;

    _classCallCheck(this, ObjectLabelsOverlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObjectLabelsOverlay).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "_renderPerspectivePopup", function (object) {
      var _this$props = _this.props,
          objectSelection = _this$props.objectSelection,
          frame = _this$props.frame,
          xvizStyleParser = _this$props.xvizStyleParser,
          style = _this$props.style,
          renderObjectLabel = _this$props.renderObjectLabel;
      var isSelected = Boolean(objectSelection[object.id]);
      var styleProps = {
        id: object.id,
        isSelected: isSelected,
        object: object,
        xvizStyles: xvizStyleParser
      };
      var labelContent = renderObjectLabel(styleProps);

      if (!labelContent) {
        return null;
      }

      var trackingPoint;
      var objectHeight;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = object.streamNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var streamName = _step.value;
          var feature = object.getFeature(streamName);

          if (!trackingPoint && (feature.center || feature.vertices)) {
            trackingPoint = positionToLngLat(object.position, _this._getCoordinateProps(streamName));
          }

          if (!objectHeight && feature.vertices) {
            objectHeight = xvizStyleParser.getStylesheet(streamName).getProperty('height', feature);
          }
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

    _this.state = {
      coordinateProps: {}
    };
    return _this;
  }

  _createClass(ObjectLabelsOverlay, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var frame = nextProps.frame;

      if (frame && frame !== this.props.frame) {
        this.setState({
          coordinateProps: {}
        });
      }
    }
  }, {
    key: "_getCoordinateProps",
    value: function _getCoordinateProps(streamName) {
      var coordinateProps = this.state.coordinateProps;
      var result = coordinateProps[streamName];

      if (result) {
        return result;
      }

      var _this$props2 = this.props,
          frame = _this$props2.frame,
          metadata = _this$props2.metadata,
          getTransformMatrix = _this$props2.getTransformMatrix;
      var streamMetadata = metadata.streams && metadata.streams[streamName];
      result = resolveCoordinateTransform(frame, streamMetadata, getTransformMatrix); // cache calculated coordinate props by stream name

      coordinateProps[streamName] = result;
      return result;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          frame = _this$props3.frame,
          viewport = _this$props3.viewport,
          renderObjectLabel = _this$props3.renderObjectLabel;

      if (!frame || !renderObjectLabel) {
        return null;
      }

      return React.createElement(MapContext.Provider, {
        value: {
          viewport: viewport
        }
      }, Object.values(frame.objects).map(this._renderPerspectivePopup));
    }
  }]);

  return ObjectLabelsOverlay;
}(PureComponent);

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

export { ObjectLabelsOverlay as default };
//# sourceMappingURL=object-labels-overlay.js.map