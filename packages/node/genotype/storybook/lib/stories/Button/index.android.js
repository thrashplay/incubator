"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Button;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Button({
  onPress,
  children
}) {
  return _react.default.createElement(_reactNative.TouchableNativeFeedback, {
    onPress: onPress
  }, children);
}

Button.defaultProps = {
  children: null,
  onPress: () => {}
};
Button.propTypes = {
  children: _propTypes.default.node,
  onPress: _propTypes.default.func
};