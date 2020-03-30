"use strict";

require("haul/hot/patch");

var _hot = require("haul/hot");

var _reactNative = require("react-native");

var _Root = _interopRequireDefault(require("./Root"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactNative.YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps has been renamed, and is not recommended for use.']);

require('RCTNativeAppEventEmitter');

_reactNative.AppRegistry.registerComponent('Genotype', (0, _hot.makeHot)(() => _Root.default));

if (module.hot) {
  module.hot.accept(() => {});
  module.hot.accept('./Root', () => {
    (0, _hot.clearCacheFor)(require.resolve('./Root'));
    (0, _hot.redraw)(() => require('./Root').default);
  });
}