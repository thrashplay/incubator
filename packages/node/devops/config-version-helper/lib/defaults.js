"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVersion = exports.getVariableName = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _fp = require("lodash/fp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getVariableName = configEntry => (0, _fp.flow)(_fp.snakeCase, _fp.toUpper, id => `${id}_VERSION`)(configEntry.id);

exports.getVariableName = getVariableName;

const generateSha256Hash = content => _crypto.default.createHash('sha256').update(content).digest('hex');

const getVersion = content => (0, _fp.flow)(generateSha256Hash, (0, _fp.truncate)({
  length: 8,
  omission: ''
}))(content);

exports.getVersion = getVersion;