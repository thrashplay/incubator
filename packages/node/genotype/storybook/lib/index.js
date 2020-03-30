"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("@storybook/react-native");

require("./rn-addons");

// import stories
(0, _reactNative.configure)(() => {
  require('./stories');
}, module); // Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI

const StorybookUIRoot = (0, _reactNative.getStorybookUI)({});
var _default = StorybookUIRoot;
exports.default = _default;