"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeSeries = getTimeSeries;

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
var getX = function getX(d) {
  return d.time;
};

var variableNullFilter = function variableNullFilter(value) {
  return value !== undefined;
};

function getTimeSeriesForStream(streamName, metadata, stream, target) {
  if (metadata.nograph) {
    return;
  }

  var mapper = metadata.valueMap;
  var scale = metadata.scale || 1;
  var getY = mapper ? function (d) {
    return mapper[d.variable];
  } : function (d) {
    return d.variable * scale;
  };
  var sampleDatum = stream.find(variableNullFilter);

  if (!sampleDatum || !Number.isFinite(getY(sampleDatum))) {
    return;
  }

  target.isLoading = false;
  target.getX = getX;
  target.getY = getY;
  target.unit = metadata.unit || '';
  target.data[streamName] = stream.filter(variableNullFilter);
}
/**
 * Get the time series for given streams
 * @param logMetadata {object} log metadata
 * @param streams array of streams data
 * @returns {Array} array of time series data
 */


function getTimeSeries(_ref) {
  var _ref$metadata = _ref.metadata,
      metadata = _ref$metadata === void 0 ? {} : _ref$metadata,
      streamNames = _ref.streamNames,
      streams = _ref.streams;
  var timeSeries = {
    isLoading: true,
    data: {}
  };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = streamNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var streamName = _step.value;
      // ui configuration for this stream
      var streamMetadata = metadata.streams && metadata.streams[streamName] || {};
      var stream = streams[streamName];

      if (stream) {
        getTimeSeriesForStream(streamName, streamMetadata, stream, timeSeries);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return timeSeries;
}
//# sourceMappingURL=metrics-helper.js.map