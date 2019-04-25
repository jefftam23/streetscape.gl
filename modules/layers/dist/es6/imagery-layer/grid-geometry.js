function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
import GL from '@luma.gl/constants';
import { Geometry } from '@luma.gl/core';
export default class GridGeometry extends Geometry {
  constructor() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$id = _ref.id,
        id = _ref$id === void 0 ? uid('grid-geometry') : _ref$id,
        _ref$uCount = _ref.uCount,
        uCount = _ref$uCount === void 0 ? 1 : _ref$uCount,
        _ref$vCount = _ref.vCount,
        vCount = _ref$vCount === void 0 ? 1 : _ref$vCount,
        _ref$drawMode = _ref.drawMode,
        drawMode = _ref$drawMode === void 0 ? GL.TRIANGLES : _ref$drawMode,
        opts = _objectWithoutProperties(_ref, ["id", "uCount", "vCount", "drawMode"]);

    super(Object.assign({}, opts, {
      id,
      drawMode,
      attributes: {
        indices: calculateIndices({
          uCount,
          vCount
        }),
        texCoords: calculateTexCoords({
          uCount,
          vCount
        })
      }
    }));
  }

}
const uidCounters = {};
/**
 * Returns a UID.
 * @param {String} id= - Identifier base name
 * @return {number} uid
 **/

function uid() {
  let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id';
  uidCounters[id] = uidCounters[id] || 1;
  const count = uidCounters[id]++;
  return "".concat(id, "-").concat(count);
}

function calculateIndices(_ref2) {
  let uCount = _ref2.uCount,
      vCount = _ref2.vCount;
  // # of squares = (nx - 1) * (ny - 1)
  // # of triangles = squares * 2
  // # of indices = triangles * 3
  const indicesCount = uCount * vCount * 2 * 3;
  const indices = new Uint32Array(indicesCount);
  let i = 0;

  for (let uIndex = 0; uIndex < uCount; uIndex++) {
    for (let vIndex = 0; vIndex < vCount; vIndex++) {
      /*
       *   i0   i1
       *    +--.+---
       *    | / |
       *    +'--+---
       *    |   |
       *   i2   i3
       */
      const i0 = vIndex * (uCount + 1) + uIndex;
      const i1 = i0 + 1;
      const i2 = i0 + uCount + 1;
      const i3 = i2 + 1;
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
  let uCount = _ref3.uCount,
      vCount = _ref3.vCount;
  const texCoords = new Float32Array((uCount + 1) * (vCount + 1) * 2);
  let i = 0;

  for (let vIndex = 0; vIndex <= vCount; vIndex++) {
    for (let uIndex = 0; uIndex <= uCount; uIndex++) {
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