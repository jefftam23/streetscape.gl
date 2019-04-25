function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

/* global window */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getXVIZConfig } from '@xviz/parser';
import DualPlaybackControl from './dual-playback-control';
import connectToLog from '../connect';
const TIME_SCALES = {
  seconds: 0.001,
  milliseconds: 1
};

class PlaybackControl extends PureComponent {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "state", {
      isPlaying: false,
      timeScale: TIME_SCALES[getXVIZConfig().TIMESTAMP_FORMAT] || 1
    });

    _defineProperty(this, "_animationFrame", null);

    _defineProperty(this, "_lastAnimationUpdate", -1);

    _defineProperty(this, "_onPlay", () => {
      this.props.onPlay();
      this.setState({
        isPlaying: true
      });
    });

    _defineProperty(this, "_onPause", () => {
      this.props.onPause();
      this.setState({
        isPlaying: false
      });
    });

    _defineProperty(this, "_onSeek", timestamp => {
      this._onTimeChange(timestamp);

      if (this.state.isPlaying) {
        this._onPause();
      }
    });

    _defineProperty(this, "_onTimeChange", timestamp => {
      const _this$props = this.props,
            log = _this$props.log,
            onSeek = _this$props.onSeek;

      if (!onSeek(timestamp) && log) {
        log.seek(timestamp);
      }
    });

    _defineProperty(this, "_onLookAheadChange", lookAhead => {
      const _this$props2 = this.props,
            log = _this$props2.log,
            onLookAheadChange = _this$props2.onLookAheadChange;

      if (!onLookAheadChange(lookAhead) && log) {
        log.setLookAhead(lookAhead);
      }
    });

    _defineProperty(this, "_animate", () => {
      if (this.state.isPlaying) {
        const now = Date.now();
        const _this$props3 = this.props,
              startTime = _this$props3.startTime,
              endTime = _this$props3.endTime,
              buffered = _this$props3.buffered,
              timestamp = _this$props3.timestamp;
        const timeScale = this.state.timeScale;
        const lastUpdate = this._lastAnimationUpdate;

        const _getXVIZConfig = getXVIZConfig(),
              PLAYBACK_FRAME_RATE = _getXVIZConfig.PLAYBACK_FRAME_RATE,
              TIME_WINDOW = _getXVIZConfig.TIME_WINDOW; // avoid skipping frames - cap delta at resolution


        let timeDeltaMs = lastUpdate > 0 ? now - lastUpdate : 0;
        timeDeltaMs = Math.min(timeDeltaMs, 1000 / PLAYBACK_FRAME_RATE);
        let newTimestamp = timestamp + timeDeltaMs * timeScale;

        if (newTimestamp > endTime) {
          newTimestamp = startTime;
        } // check buffer availability


        if (buffered.some(r => newTimestamp >= r[0] && newTimestamp <= r[1] + TIME_WINDOW)) {
          // only move forward if buffer is loaded
          // otherwise pause and wait
          this._onTimeChange(newTimestamp);
        }

        this._lastAnimationUpdate = now;
        this._animationFrame = window.requestAnimationFrame(this._animate);
      }
    });

    _defineProperty(this, "_formatTime", function (x) {
      let formatter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      const startTime = _this.props.startTime;
      const timeScale = _this.state.timeScale;

      if (formatter) {
        return formatter(x, startTime);
      }

      const deltaTimeS = (x - startTime) / timeScale / 1000;
      return DualPlaybackControl.formatTimeCode(deltaTimeS, '{mm}:{ss}');
    });

    _defineProperty(this, "_formatTick", x => {
      return this._formatTime(x, this.props.formatTick);
    });

    _defineProperty(this, "_formatTimestamp", x => {
      return this._formatTime(x, this.props.formatTimestamp);
    });

    _defineProperty(this, "_formatLookAhead", x => {
      const formatLookAhead = this.props.formatLookAhead;
      const timeScale = this.state.timeScale;

      if (formatLookAhead) {
        return formatLookAhead(x);
      }

      const deltaTimeS = x / timeScale / 1000;
      return DualPlaybackControl.formatTimeCode(deltaTimeS, '{s}.{S}s');
    });
  }

  componentWillReceiveProps(nextProps) {
    if ('isPlaying' in nextProps) {
      this.setState({
        isPlaying: Boolean(nextProps.isPlaying)
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const isPlaying = this.state.isPlaying;

    if (isPlaying && prevState.isPlaying !== isPlaying) {
      this._lastAnimationUpdate = Date.now();
      this._animationFrame = window.requestAnimationFrame(this._animate);
    }
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  render() {
    const _this$props4 = this.props,
          startTime = _this$props4.startTime,
          endTime = _this$props4.endTime,
          timestamp = _this$props4.timestamp,
          lookAhead = _this$props4.lookAhead,
          buffered = _this$props4.buffered,
          otherProps = _objectWithoutProperties(_this$props4, ["startTime", "endTime", "timestamp", "lookAhead", "buffered"]);

    if (!Number.isFinite(timestamp) || !Number.isFinite(startTime)) {
      return null;
    }

    const bufferRange = buffered.map(r => ({
      startTime: Math.max(r[0], startTime),
      endTime: Math.min(r[1], endTime)
    }));
    return React.createElement(DualPlaybackControl, _extends({}, otherProps, {
      bufferRange: bufferRange,
      currentTime: timestamp,
      lookAhead: lookAhead,
      startTime: startTime,
      endTime: endTime,
      isPlaying: this.state.isPlaying,
      formatTick: this._formatTick,
      formatTimestamp: this._formatTimestamp,
      formatLookAhead: this._formatLookAhead,
      onSeek: this._onSeek,
      onPlay: this._onPlay,
      onPause: this._onPause,
      onLookAheadChange: this._onLookAheadChange
    }));
  }

}

_defineProperty(PlaybackControl, "propTypes", {
  // from log
  timestamp: PropTypes.number,
  lookAhead: PropTypes.number,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  buffered: PropTypes.array,
  // state override
  isPlaying: PropTypes.bool,
  // config
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  compact: PropTypes.bool,
  className: PropTypes.string,
  step: PropTypes.number,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  tickSpacing: PropTypes.number,
  markers: PropTypes.arrayOf(PropTypes.object),
  formatTick: PropTypes.func,
  formatTimestamp: PropTypes.func,
  // dual playback control config
  maxLookAhead: PropTypes.number,
  formatLookAhead: PropTypes.func,
  // callbacks
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onSeek: PropTypes.func,
  onLookAheadChange: PropTypes.func
});

_defineProperty(PlaybackControl, "defaultProps", DualPlaybackControl.defaultProps);

const getLogState = log => ({
  timestamp: log.getCurrentTime(),
  lookAhead: log.getLookAhead(),
  startTime: log.getLogStartTime(),
  endTime: log.getLogEndTime(),
  buffered: log.getBufferedTimeRanges()
});

export default connectToLog({
  getLogState,
  Component: PlaybackControl
});
//# sourceMappingURL=index.js.map