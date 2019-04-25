function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
import WebMercatorViewport from 'viewport-mercator-project';
import { MapView, FirstPersonView } from '@deck.gl/core';
export function getViewStateOffset(oldViewState, viewState, oldOffset) {
  if (!oldViewState) {
    return oldOffset;
  }

  const oldViewport = new WebMercatorViewport(oldViewState);
  const oldPos = [oldViewport.width / 2 + oldOffset.x, oldViewport.height / 2 + oldOffset.y];
  const trackedLngLat = oldViewport.unproject(oldPos);
  const newViewport = new WebMercatorViewport(viewState);
  const newPos = newViewport.project(trackedLngLat);
  return {
    x: oldOffset.x + newPos[0] - oldPos[0],
    y: oldOffset.y + newPos[1] - oldPos[1],
    bearing: oldOffset.bearing + viewState.bearing - oldViewState.bearing
  };
} // Adjust lng/lat to position the car 1/4 from screen bottom

function offsetViewState(viewState, offset) {
  const shiftedViewState = _objectSpread({}, viewState, {
    bearing: viewState.bearing + offset.bearing
  });

  const helperViewport = new WebMercatorViewport(shiftedViewState);
  const pos = [viewState.width / 2 + offset.x, viewState.height / 2 + offset.y];
  const lngLat = [viewState.longitude, viewState.latitude];

  const _helperViewport$getLo = helperViewport.getLocationAtPoint({
    lngLat,
    pos
  }),
        _helperViewport$getLo2 = _slicedToArray(_helperViewport$getLo, 2),
        longitude = _helperViewport$getLo2[0],
        latitude = _helperViewport$getLo2[1];

  return _objectSpread({}, shiftedViewState, {
    longitude,
    latitude
  });
}

export function getViews(viewMode) {
  const name = viewMode.name,
        orthographic = viewMode.orthographic,
        firstPerson = viewMode.firstPerson,
        mapInteraction = viewMode.mapInteraction;

  const controllerProps = _objectSpread({}, mapInteraction, {
    keyboard: false
  });

  if (firstPerson) {
    return new FirstPersonView({
      id: name,
      fovy: 75,
      near: 1,
      far: 10000,
      focalDistance: 6,
      controller: controllerProps
    });
  }

  return new MapView({
    id: name,
    orthographic,
    controller: controllerProps
  });
} // Creates viewports that contains information about car position and heading

export function getViewStates(_ref) {
  let viewState = _ref.viewState,
      trackedPosition = _ref.trackedPosition,
      viewMode = _ref.viewMode,
      offset = _ref.offset;
  const name = viewMode.name,
        firstPerson = viewMode.firstPerson,
        _viewMode$tracked = viewMode.tracked,
        tracked = _viewMode$tracked === void 0 ? {} : _viewMode$tracked;
  const viewStates = {};

  if (firstPerson) {
    if (trackedPosition) {
      const bearing = trackedPosition.bearing;
      viewState = _objectSpread({}, viewState, firstPerson, {
        longitude: trackedPosition.longitude,
        latitude: trackedPosition.latitude,
        bearing: bearing + offset.bearing
      });
    }

    viewStates[name] = viewState;
  } else {
    viewState = _objectSpread({}, viewState);
    offset = _objectSpread({}, offset); // Track car position & heading

    if (tracked.position && trackedPosition) {
      viewState.longitude = trackedPosition.longitude;
      viewState.latitude = trackedPosition.latitude;
    } else {
      offset.x = 0;
      offset.y = 0;
    }

    if (tracked.heading && trackedPosition) {
      viewState.bearing = trackedPosition.bearing;
    } else {
      offset.bearing = 0;
    }

    viewStates[name] = offsetViewState(viewState, offset);
  }

  return viewStates;
}
/* eslint-enable max-params */
//# sourceMappingURL=viewport.js.map