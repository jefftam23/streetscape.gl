function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { _Pose as Pose, Matrix4 } from 'math.gl';
import { addMetersToLngLat } from 'viewport-mercator-project';
import { COORDINATE } from '../constants'; // keep in sync with core-3d-viewer.js

var DEFAULT_ORIGIN = [0, 0, 0];
export function resolveCoordinateTransform(frame) {
  var streamMetadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var getTransformMatrix = arguments.length > 2 ? arguments[2] : undefined;
  var origin = frame.origin,
      _frame$transforms = frame.transforms,
      transforms = _frame$transforms === void 0 ? {} : _frame$transforms,
      vehicleRelativeTransform = frame.vehicleRelativeTransform;
  var coordinate = streamMetadata.coordinate,
      transform = streamMetadata.transform,
      pose = streamMetadata.pose;
  var coordinateSystem = COORDINATE_SYSTEM.METER_OFFSETS;
  var modelMatrix = null;
  var streamTransform = transform;

  switch (coordinate) {
    case COORDINATE.GEOGRAPHIC:
      coordinateSystem = COORDINATE_SYSTEM.LNGLAT;
      break;

    case COORDINATE.DYNAMIC:
      // cache calculated transform matrix for each frame
      transforms[transform] = transforms[transform] || getTransformMatrix(transform, frame);
      modelMatrix = transforms[transform];
      frame.transforms = transforms;
      streamTransform = null;
      break;

    case COORDINATE.VEHICLE_RELATIVE:
      modelMatrix = vehicleRelativeTransform;
      break;

    case COORDINATE.IDENTITY:
    default:
  }

  if (pose) {
    // TODO - remove when builder updates
    streamTransform = new Pose(pose).getTransformationMatrix();
  }

  if (streamTransform) {
    modelMatrix = modelMatrix ? new Matrix4(modelMatrix).multiplyRight(streamTransform) : streamTransform;
  }

  return {
    coordinateSystem: coordinateSystem,
    coordinateOrigin: origin || DEFAULT_ORIGIN,
    modelMatrix: modelMatrix
  };
}
export function positionToLngLat(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 3),
      x = _ref3[0],
      y = _ref3[1],
      z = _ref3[2];

  var coordinateSystem = _ref2.coordinateSystem,
      coordinateOrigin = _ref2.coordinateOrigin,
      modelMatrix = _ref2.modelMatrix;

  if (modelMatrix) {
    var _transformVector = new Matrix4(modelMatrix).transformVector([x, y, z, 1]);

    var _transformVector2 = _slicedToArray(_transformVector, 3);

    x = _transformVector2[0];
    y = _transformVector2[1];
    z = _transformVector2[2];
  }

  switch (coordinateSystem) {
    case COORDINATE_SYSTEM.METER_OFFSETS:
      return addMetersToLngLat(coordinateOrigin, [x, y, z]);

    case COORDINATE_SYSTEM.LNGLAT:
    default:
      return [x, y, z];
  }
}
//# sourceMappingURL=transform.js.map