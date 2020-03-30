"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelloWorld = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HelloWorld = () => _react.default.createElement(_reactNative.Text, null, "Hello, world!");

exports.HelloWorld = HelloWorld;