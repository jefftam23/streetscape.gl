"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeXVIZStyles = mergeXVIZStyles;

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

/**
 * Deep merges two XVIZ style objects.
 * The primary style stream rules will take precedence over the secondary rules.
 *
 * @param style1 {object} Secondary stylesheet
 * @param style2 {object} Primary stylesheet
 * @returns {object} Merged stylesheet with Primary rules taking precedence
 */
function mergeXVIZStyles(style1, style2) {
  if (!style1) {
    return style2 || {};
  }

  if (!style2) {
    return style1;
  }

  var mergedStyles = _objectSpread({}, style1);

  for (var streamName in style2) {
    if (mergedStyles[streamName]) {
      var rules1 = style1[streamName];
      var rules2 = style2[streamName];
      mergedStyles[streamName] = rules1.concat(rules2);
    } else {
      mergedStyles[streamName] = style2[streamName];
    }
  }

  return mergedStyles;
}
//# sourceMappingURL=style.js.map