"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveCoordinateTransform = resolveCoordinateTransform;
exports.positionToLngLat = positionToLngLat;

var _core = require("@deck.gl/core");

var _math = require("math.gl");

var _viewportMercatorProject = require("viewport-mercator-project");

var _constants = require("../constants");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// keep in sync with core-3d-viewer.js
var DEFAULT_ORIGIN = [0, 0, 0];

function resolveCoordinateTransform(frame) {
  var streamMetadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var getTransformMatrix = arguments.length > 2 ? arguments[2] : undefined;
  var origin = frame.origin,
      _frame$transforms = frame.transforms,
      transforms = _frame$transforms === void 0 ? {} : _frame$transforms,
      vehicleRelativeTransform = frame.vehicleRelativeTransform;
  var coordinate = streamMetadata.coordinate,
      transform = streamMetadata.transform,
      pose = streamMetadata.pose;
  var coordinateSystem = _core.COORDINATE_SYSTEM.METER_OFFSETS;
  var modelMatrix = null;
  var streamTransform = transform;

  switch (coordinate) {
    case _constants.COORDINATE.GEOGRAPHIC:
      coordinateSystem = _core.COORDINATE_SYSTEM.LNGLAT;
      break;

    case _constants.COORDINATE.DYNAMIC:
      // cache calculated transform matrix for each frame
      transforms[transform] = transforms[transform] || getTransformMatrix(transform, frame);
      modelMatrix = transforms[transform];
      frame.transforms = transforms;
      streamTransform = null;
      break;

    case _constants.COORDINATE.VEHICLE_RELATIVE:
      modelMatrix = vehicleRelativeTransform;
      break;

    case _constants.COORDINATE.IDENTITY:
    default:
  }

  if (pose) {
    // TODO - remove when builder updates
    streamTransform = new _math._Pose(pose).getTransformationMatrix();
  }

  if (streamTransform) {
    modelMatrix = modelMatrix ? new _math.Matrix4(modelMatrix).multiplyRight(streamTransform) : streamTransform;
  }

  return {
    coordinateSystem: coordinateSystem,
    coordinateOrigin: origin || DEFAULT_ORIGIN,
    modelMatrix: modelMatrix
  };
}

function positionToLngLat(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 3),
      x = _ref3[0],
      y = _ref3[1],
      z = _ref3[2];

  var coordinateSystem = _ref2.coordinateSystem,
      coordinateOrigin = _ref2.coordinateOrigin,
      modelMatrix = _ref2.modelMatrix;

  if (modelMatrix) {
    var _transformVector = new _math.Matrix4(modelMatrix).transformVector([x, y, z, 1]);

    var _transformVector2 = _slicedToArray(_transformVector, 3);

    x = _transformVector2[0];
    y = _transformVector2[1];
    z = _transformVector2[2];
  }

  switch (coordinateSystem) {
    case _core.COORDINATE_SYSTEM.METER_OFFSETS:
      return (0, _viewportMercatorProject.addMetersToLngLat)(coordinateOrigin, [x, y, z]);

    case _core.COORDINATE_SYSTEM.LNGLAT:
    default:
      return [x, y, z];
  }
}
//# sourceMappingURL=transform.js.map