"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CenterView;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

var _style = _interopRequireDefault(require("./style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CenterView({
  children
}) {
  return _react.default.createElement(_reactNative.View, {
    style: _style.default.main
  }, children);
}

CenterView.defaultProps = {
  children: null
};
CenterView.propTypes = {
  children: _propTypes.default.node
};