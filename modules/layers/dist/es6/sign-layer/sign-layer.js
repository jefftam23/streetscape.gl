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
import { IconLayer } from '@deck.gl/layers';
import vs from './sign-layer-vertex.glsl';
import fs from './sign-layer-fragment.glsl';

const defaultProps = _objectSpread({}, IconLayer.defaultProps, {
  sizeUnits: 'meters',
  render3D: true
});

export default class SignLayer extends IconLayer {
  updateState({
    oldProps,
    props,
    changeFlags
  }) {
    super.updateState({
      props,
      oldProps,
      changeFlags
    });

    if (props.render3D !== oldProps.render3D) {
      this.state.model.setUniforms({
        render3D: props.render3D ? 1 : 0
      });
    }
  }

  getShaders() {
    return _objectSpread({}, super.getShaders(), {
      vs,
      fs
    });
  }

}
SignLayer.layerName = 'SignLayer';
SignLayer.defaultProps = defaultProps;
//# sourceMappingURL=sign-layer.js.map