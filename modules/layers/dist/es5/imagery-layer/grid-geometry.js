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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _core = require("@luma.gl/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GridGeometry =
/*#__PURE__*/
function (_Geometry) {
  _inherits(GridGeometry, _Geometry);

  function GridGeometry() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$id = _ref.id,
        id = _ref$id === void 0 ? uid('grid-geometry') : _ref$id,
        _ref$uCount = _ref.uCount,
        uCount = _ref$uCount === void 0 ? 1 : _ref$uCount,
        _ref$vCount = _ref.vCount,
        vCount = _ref$vCount === void 0 ? 1 : _ref$vCount,
        _ref$drawMode = _ref.drawMode,
        drawMode = _ref$drawMode === void 0 ? _constants.default.TRIANGLES : _ref$drawMode,
        opts = _objectWithoutProperties(_ref, ["id", "uCount", "vCount", "drawMode"]);

    _classCallCheck(this, GridGeometry);

    return _possibleConstructorReturn(this, _getPrototypeOf(GridGeometry).call(this, Object.assign({}, opts, {
      id: id,
      drawMode: drawMode,
      attributes: {
        indices: calculateIndices({
          uCount: uCount,
          vCount: vCount
        }),
        texCoords: calculateTexCoords({
          uCount: uCount,
          vCount: vCount
        })
      }
    })));
  }

  return GridGeometry;
}(_core.Geometry);

exports.default = GridGeometry;
var uidCounters = {};
/**
 * Returns a UID.
 * @param {String} id= - Identifier base name
 * @return {number} uid
 **/

function uid() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id';
  uidCounters[id] = uidCounters[id] || 1;
  var count = uidCounters[id]++;
  return "".concat(id, "-").concat(count);
}

function calculateIndices(_ref2) {
  var uCount = _ref2.uCount,
      vCount = _ref2.vCount;
  // # of squares = (nx - 1) * (ny - 1)
  // # of triangles = squares * 2
  // # of indices = triangles * 3
  var indicesCount = uCount * vCount * 2 * 3;
  var indices = new Uint32Array(indicesCount);
  var i = 0;

  for (var uIndex = 0; uIndex < uCount; uIndex++) {
    for (var vIndex = 0; vIndex < vCount; vIndex++) {
      /*
       *   i0   i1
       *    +--.+---
       *    | / |
       *    +'--+---
       *    |   |
       *   i2   i3
       */
      var i0 = vIndex * (uCount + 1) + uIndex;
      var i1 = i0 + 1;
      var i2 = i0 + uCount + 1;
      var i3 = i2 + 1;
      indices[i++] = i0;
      indices[i++] = i2;
      indices[i++] = i1;
      indices[i++] = i1;
      indices[i++] = i2;
      indices[i++] = i3;
    }
  }

  return indices;
}

function calculateTexCoords(_ref3) {
  var uCount = _ref3.uCount,
      vCount = _ref3.vCount;
  var texCoords = new Float32Array((uCount + 1) * (vCount + 1) * 2);
  var i = 0;

  for (var vIndex = 0; vIndex <= vCount; vIndex++) {
    for (var uIndex = 0; uIndex <= uCount; uIndex++) {
      texCoords[i++] = uIndex / uCount;
      texCoords[i++] = vIndex / vCount;
    }
  }

  return {
    value: texCoords,
    size: 2
  };
}
//# sourceMappingURL=grid-geometry.js.map