"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixWebpackConfig = exports.removeEntries = exports.addEntries = exports.expandRuleTests = exports.addResolveExtensions = exports.addResolvePlugin = void 0;

var _lodash = require("lodash");

var _tsconfigPathsWebpackPlugin = _interopRequireDefault(require("tsconfig-paths-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const createTsconfigPathsPlugin = (config, options = {}) => {
  return new _tsconfigPathsWebpackPlugin.default(_objectSpread({
    extensions: (0, _lodash.get)(config, 'resolve.extensions'),
    mainFields: (0, _lodash.get)(config, 'resolve.mainFields')
  }, options));
};
/**
 * Returns a webpack config that includes the specified resolve plugin. The original configuration is
 * not changed.
 */


const addResolvePlugin = (config, plugin) => {
  const resolve = (0, _lodash.get)(config, 'resolve', {});
  const plugins = (0, _lodash.concat)((0, _lodash.get)(resolve, 'plugins', []), plugin);
  return _objectSpread({}, config, {
    resolve: _objectSpread({}, resolve, {
      plugins
    })
  });
};
/**
 * Returns a webpack config that includes the specified resolve extensions. The original configuration is
 * not changed. Any duplicate extensions are filtered out.
 */


exports.addResolvePlugin = addResolvePlugin;

const addResolveExtensions = (config, newExtensions) => {
  const resolve = (0, _lodash.get)(config, 'resolve', {});
  const extensions = (0, _lodash.uniq)((0, _lodash.concat)((0, _lodash.get)(resolve, 'extensions', []), (0, _lodash.castArray)(newExtensions)));
  return _objectSpread({}, config, {
    resolve: _objectSpread({}, resolve, {
      extensions
    })
  });
};
/**
 * Returns a webpack config that widens the 'test' expression for one or more rules. Each configured 'rule'
 * in the supplied config will be passed to the 'ruleMatcher' function. Any rule for which this function 
 * returns true will have it's 'test' expanded such that any resource matching the previous test -or- the
 * specified 'additionalTest' will be considered a match.
 * 
 * This function ignores any rules that do not have a 'test' property, or that have a 'test' property that
 * is neither a string or a RegExp.
 */


exports.addResolveExtensions = addResolveExtensions;

const expandRuleTests = (config, additionalTest, ruleMatcher) => {
  const getExpandedRuleRegex = (originalTest, additionalTest) => {
    const original = (0, _lodash.isRegExp)(originalTest) ? originalTest.source : originalSource.toString();
    const additional = (0, _lodash.isRegExp)(additionalTest) ? additionalTest.source : additionalTest.toString();
    return new RegExp(`(${original}|${additional})`);
  };

  const createRuleWithExpandedRegex = rule => {
    const test = (0, _lodash.get)(rule, 'test');

    if (((0, _lodash.isRegExp)(test) || (0, _lodash.isString)(test)) && ruleMatcher(rule)) {
      return _objectSpread({}, rule, {
        test: getExpandedRuleRegex(test, additionalTest)
      });
    } else {
      return rule;
    }
  };

  const originalModule = (0, _lodash.get)(config, 'module');
  const originalRules = (0, _lodash.get)(config, 'module.rules');

  if ((0, _lodash.isNil)(originalRules)) {
    // no rules to modify
    return config;
  }

  return _objectSpread({}, config, {
    module: _objectSpread({}, originalModule, {
      rules: (0, _lodash.map)(originalRules, createRuleWithExpandedRegex)
    })
  });
};
/**
 * Returns a webpack config with the specified additional 'entry' values prepended to the existing 'entry' array. 
 * Any duplicate entries are removed. The original configuration is not changed.
 */


exports.expandRuleTests = expandRuleTests;

const addEntries = (config, newEntries) => {
  const entries = (0, _lodash.uniq)((0, _lodash.concat)(newEntries, (0, _lodash.get)(config, 'entry', [])));
  return _objectSpread({}, config, {
    entry: entries
  });
};
/**
 * Returns a webpack config that excludes any entries matching the specified list of regular expressions to
 * exclude. The original configuration is not changed.
 */


exports.addEntries = addEntries;

const removeEntries = (config, exclusionPatterns) => {
  const matchesExcludedPattern = entry => (0, _lodash.some)(exclusionPatterns, pattern => pattern.test(entry));

  const entries = (0, _lodash.filter)((0, _lodash.get)(config, 'entry', []), (0, _lodash.negate)(matchesExcludedPattern));
  return _objectSpread({}, config, {
    entry: entries
  });
};
/**
 * Returns a Haul webpack config with legacy Haul polyfills replaced with the corresponding React Native polyfills.
 * The original configuration is not changed.
 * 
 * This resolves a red screen TypeError: "console.assert is not a function"
 */


exports.removeEntries = removeEntries;

const replaceLegacyHaulPolyfills = config => {
  const removeLegacyHaulPolyfills = config => removeEntries(config, [/haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]console\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]error-guard\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]polyfillEnvironment\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Number\.es6\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Object\.es6\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Object\.es7\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]String\.prototype\.es6\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Array\.prototype\.es6\.js/g, /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Array\.es6\.js/g]);

  const addReactNativePolyfills = config => addEntries(config, require('react-native/rn-get-polyfills')());

  return (0, _lodash.flow)(removeLegacyHaulPolyfills, addReactNativePolyfills)(config);
};
/**
 * Returns true if the specified value is a Webpack rule with at least one 'babel-loader' configured.
 */


const isBabelLoaderRule = rule => {
  const regex = /babel-loader/;

  const isBabelLoaderEntry = useEntry => (0, _lodash.isString)(useEntry) ? regex.test(useEntry) : regex.test((0, _lodash.get)(useEntry, 'loader', ''));

  return (0, _lodash.some)((0, _lodash.castArray)((0, _lodash.get)(rule, 'use', [])), isBabelLoaderEntry);
};
/**
 * Returns a Haul webpack config with the necessary configuration to use JSX in plain Javascript. The original 
 * configuration  not changed.
 * 
 * The configuration added by this function is:
 *   - resolve '.jsx' extensions
 *   - configure the Babel loader rule for '.jsx' files
 */


const addJsxSupport = platform => config => {
  const addTsconfigPathsPlugin = config => addResolvePlugin(config, createTsconfigPathsPlugin(config));

  const addJsxExtensions = config => addResolveExtensions(config, ['.jsx', `.${platform}.jsx`, '.native.jsx']);

  const addJsxToBabelRule = config => expandRuleTests(config, /\.jsx$/, isBabelLoaderRule);

  return (0, _lodash.flow)(addJsxExtensions, addJsxToBabelRule)(config);
};
/**
 * Returns a Haul webpack config with the necessary configuration to use TypeScript. The original configuration
 * is not changed.
 * 
 * The configuration added by this function is:
 *   - resolve '.ts' and '.tsx' extensions
 *   - add a Babel loader rule for '.ts' and '.tsx' files
 *   - configure the TsconfigPathsPlugin resolve plugin
 */


const addTypeScriptSupport = platform => config => {
  const addTsconfigPathsPlugin = config => addResolvePlugin(config, createTsconfigPathsPlugin(config));

  const addTypescriptExtensions = config => addResolveExtensions(config, ['.ts', '.tsx', `.${platform}.ts`, '.native.ts', `.${platform}.tsx`, '.native.tsx']);

  const addTypeScriptToBabelRule = config => expandRuleTests(config, /\.tsx?$/, isBabelLoaderRule);

  return (0, _lodash.flow)(addTypescriptExtensions, addTypeScriptToBabelRule, addTsconfigPathsPlugin)(config);
};

const logConfigToConsole = config => {
  console.log('Webpack Config:', JSON.stringify(config, null, 2));
  return config;
};

const fixWebpackConfig = (env, config) => {
  return (0, _lodash.flow)(addJsxSupport(env.platform), addTypeScriptSupport(env.platform), replaceLegacyHaulPolyfills, logConfigToConsole)(config);
};

exports.fixWebpackConfig = fixWebpackConfig;