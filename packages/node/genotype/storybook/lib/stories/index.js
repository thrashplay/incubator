"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNative2 = require("@storybook/react-native");

var _addonActions = require("@storybook/addon-actions");

var _addonLinks = require("@storybook/addon-links");

var _genotypeComponents = require("@thrashplay/genotype-components");

var _Button = _interopRequireDefault(require("./Button"));

var _CenterView = _interopRequireDefault(require("./CenterView"));

var _welcome = _interopRequireDefault(require("./welcome"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactNative2.storiesOf)('Welcome', module).add('to Storybook', () => _react.default.createElement(_welcome.default, {
  showApp: (0, _addonLinks.linkTo)('Button')
}));
(0, _reactNative2.storiesOf)('Button', module).addDecorator(getStory => _react.default.createElement(_CenterView.default, null, getStory())).add('with text', () => _react.default.createElement(_Button.default, {
  onPress: (0, _addonActions.action)('clicked-text')
}, _react.default.createElement(_reactNative.Text, null, "Hello Button"))).add('with some emoji', () => _react.default.createElement(_Button.default, {
  onPress: (0, _addonActions.action)('clicked-emoji')
}, _react.default.createElement(_reactNative.Text, null, "\uD83D\uDE00 \uD83D\uDE0E \uD83D\uDC4D \uD83D\uDCAF")));
(0, _reactNative2.storiesOf)('Hello World', module).addDecorator(getStory => _react.default.createElement(_CenterView.default, null, getStory())).add('default', () => _react.default.createElement(_genotypeComponents.HelloWorld, null));