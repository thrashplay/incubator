"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResult = exports.calculateVersion = exports.addContent = exports.getFileConfigsFromStack = void 0;

var _fp = require("lodash/fp");

var _fp2 = require("@thrashplay/fp");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Create a ConfigEntry for every `config` in the StackDefinition that has a 'file' property.
 */
const getFileConfigsFromStack = stack => {
  const createConfigEntry = id => {
    const config = (0, _fp.get)(['configs', id])(stack);
    return {
      id,
      name: config.name,
      path: config.file
    };
  };

  const hasPath = entry => !(0, _fp.isNil)(entry.path);

  return (0, _fp.flow)((0, _fp.getOr)({}, 'configs'), _fp.keysIn, (0, _fp.map)(createConfigEntry), (0, _fp.filter)(hasPath))(stack);
};
/**
 * Uses the supplied `readContent` function to retrieve the content for a config entry, and
 * return a new config entry with the content attached.
 * 
 * Returns a ConfigEntryWithError if readContent throws an exception, otherwise returns a
 * ConfigEntryWithContent.
 */


exports.getFileConfigsFromStack = getFileConfigsFromStack;

const addContent = readContent => configEntry => {
  const contentOrError = (0, _fp.attempt)(() => readContent(configEntry));
  return (0, _fp.isError)(contentOrError) ? _objectSpread({}, configEntry, {
    error: contentOrError
  }) : _objectSpread({}, configEntry, {
    content: contentOrError
  });
};
/**
 * Uses the supplied `getVersion` function to calculate the version string for a config entry.
 * 
 * Returns a ConfigEntryWithError if getVersion throws an exception, otherwise returns a
 * VersionedConfigEntry.
 */


exports.addContent = addContent;

const calculateVersion = getVersion => configEntry => {
  const versionOrError = (0, _fp.attempt)(() => getVersion(configEntry.content, configEntry));
  return (0, _fp.isError)(versionOrError) ? _objectSpread({}, configEntry, {
    error: versionOrError
  }) : _objectSpread({}, configEntry, {
    version: versionOrError
  });
};
/**
 * Converts an array of config entries (either versioned, or with errors) into a ConfigVersionsResult.
 */


exports.calculateVersion = calculateVersion;

const createResult = getVariableName => configEntries => {
  const hasError = configEntry => (0, _fp.flow)((0, _fp.get)('error'), (0, _fp.negate)(_fp.isUndefined))(configEntry);

  const createVariableInfo = configEntry => ({
    name: getVariableName(configEntry),
    version: configEntry.version
  });

  return (0, _fp.flow)((0, _fp2.mapIf)((0, _fp.negate)(hasError), createVariableInfo), (0, _fp.partition)(hasError), (0, _fp.zipObject)(['invalidConfigs', 'variables']))(configEntries);
};

exports.createResult = createResult;