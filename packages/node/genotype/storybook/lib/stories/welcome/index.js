"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Welcome extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "styles", {
      wrapper: {
        flex: 1,
        padding: 24,
        justifyContent: 'center'
      },
      header: {
        fontSize: 18,
        marginBottom: 18
      },
      content: {
        fontSize: 12,
        marginBottom: 10,
        lineHeight: 18
      }
    });

    _defineProperty(this, "showApp", event => {
      const {
        showApp
      } = this.props;
      event.preventDefault();

      if (showApp) {
        showApp();
      }
    });
  }

  render() {
    return _react.default.createElement(_reactNative.View, {
      style: this.styles.wrapper
    }, _react.default.createElement(_reactNative.Text, {
      style: this.styles.header
    }, "Welcome to React Native Storybook"), _react.default.createElement(_reactNative.Text, {
      style: this.styles.content
    }, "This is a UI Component development environment for your React Native app. Here you can display and interact with your UI components as stories. A story is a single state of one or more UI components. You can have as many stories as you want. In other words a story is like a visual test case."), _react.default.createElement(_reactNative.Text, {
      style: this.styles.content
    }, "We have added some stories inside the \"storybook/stories\" directory for examples. Try editing the \"storybook/stories/Welcome.js\" file to edit this message."));
  }

}

exports.default = Welcome;
Welcome.defaultProps = {
  showApp: null
};
Welcome.propTypes = {
  showApp: _propTypes.default.func
};