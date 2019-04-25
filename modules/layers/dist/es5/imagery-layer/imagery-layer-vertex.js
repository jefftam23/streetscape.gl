"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
var _default = "\n#define SHADER_NAME imagery-layer-vertex-shader\n\nattribute vec2 texCoords;\n\nuniform bool hasHeightMap;\nuniform sampler2D heightMapTexture;\nuniform vec4 heightMapBounds;\nuniform vec2 heightRange;\nuniform vec4 imageryBounds;\n\nvarying vec2 vTexCoord;\n\n// HACK/ib - Expose vWorldHeight to enable derivatives in fragment shader\nvarying float vWorldHeight;\n\nvec2 getUV(vec4 bounds, vec2 coords) {\n  return vec2(\n    (coords.x - bounds[0]) / (bounds[2] - bounds[0]),\n    (coords.y - bounds[1]) / (bounds[3] - bounds[1])\n  );\n}\n\nvoid main(void) {\n  // Calculate vertex position\n  vec2 position = vec2(\n    mix(imageryBounds[0], imageryBounds[2], texCoords.x),\n    mix(imageryBounds[1], imageryBounds[3], texCoords.y)\n  );\n\n  float z = 0.0;\n  // Handle heightMap if provided\n  if (hasHeightMap) {\n    vec4 heightMapColor = texture2D(heightMapTexture, getUV(heightMapBounds, position));\n    float relativeHeight = heightMapColor.b;\n    z = mix(heightRange[0], heightRange[1], relativeHeight);\n  }\n\n  vWorldHeight = z;\n  vTexCoord = texCoords;\n\n  gl_Position = project_position_to_clipspace(vec3(position, z), vec2(0.0), vec3(0.0));\n\n  picking_setPickingColor(vec3(0., 0., 1.));\n}\n";
exports["default"] = _default;
//# sourceMappingURL=imagery-layer-vertex.js.map