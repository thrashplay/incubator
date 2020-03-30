import { castArray, concat, filter, flow, get, isNil, isRegExp, isString, map, negate, some, uniq } from 'lodash'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const createTsconfigPathsPlugin = (config, options = {}) => {
  return new TsconfigPathsPlugin({
    extensions: get(config, 'resolve.extensions'),
    mainFields: get(config, 'resolve.mainFields'),
    ...options,
  })
}

/**
 * Returns a webpack config that includes the specified resolve plugin. The original configuration is
 * not changed.
 */
export const addResolvePlugin = (config, plugin) => {
  const resolve = get(config, 'resolve', {})
  const plugins = concat(get(resolve, 'plugins', []), plugin)
  return {
    ...config,
    resolve: {
      ...resolve,
      plugins,
    },
  }
}

/**
 * Returns a webpack config that includes the specified resolve extensions. The original configuration is
 * not changed. Any duplicate extensions are filtered out.
 */
export const addResolveExtensions = (config, newExtensions) => {
  const resolve = get(config, 'resolve', {})
  const extensions = uniq(concat(get(resolve, 'extensions', []), castArray(newExtensions)))
  return {
    ...config,
    resolve: {
      ...resolve,
      extensions,
    },
  }
}

/**
 * Returns a webpack config that widens the 'test' expression for one or more rules. Each configured 'rule'
 * in the supplied config will be passed to the 'ruleMatcher' function. Any rule for which this function 
 * returns true will have it's 'test' expanded such that any resource matching the previous test -or- the
 * specified 'additionalTest' will be considered a match.
 * 
 * This function ignores any rules that do not have a 'test' property, or that have a 'test' property that
 * is neither a string or a RegExp.
 */
export const expandRuleTests = (config, additionalTest, ruleMatcher) => {
  const getExpandedRuleRegex = (originalTest, additionalTest) => {
    const original = isRegExp(originalTest) ? originalTest.source : originalSource.toString()
    const additional = isRegExp(additionalTest) ? additionalTest.source : additionalTest.toString()
    return new RegExp(`(${original}|${additional})`)
  }

  const createRuleWithExpandedRegex = (rule) => {
    const test = get(rule, 'test')
    if ((isRegExp(test) || isString(test)) && ruleMatcher(rule)) {
      return {
        ...rule,
        test: getExpandedRuleRegex(test, additionalTest),
      }
    } else {
      return rule
    }
  }

  const originalModule = get(config, 'module')
  const originalRules = get(config, 'module.rules')
  if (isNil(originalRules)) {
    // no rules to modify
    return config
  }

  return {
    ...config,
    module: {
      ...originalModule,
      rules: map(originalRules, createRuleWithExpandedRegex),
    },
  }
}

/**
 * Returns a webpack config with the specified additional 'entry' values prepended to the existing 'entry' array. 
 * Any duplicate entries are removed. The original configuration is not changed.
 */
export const addEntries = (config, newEntries) => {
  const entries = uniq(concat(newEntries, get(config, 'entry', [])))
  return {
    ...config,
    entry: entries,
  }
}

/**
 * Returns a webpack config that excludes any entries matching the specified list of regular expressions to
 * exclude. The original configuration is not changed.
 */
export const removeEntries = (config, exclusionPatterns) => {
  const matchesExcludedPattern = (entry) => some(exclusionPatterns, (pattern) => pattern.test(entry))
  
  const entries = filter(get(config, 'entry', []), negate(matchesExcludedPattern))
  return {
    ...config,
    entry: entries,
  }
}

/**
 * Returns a Haul webpack config with legacy Haul polyfills replaced with the corresponding React Native polyfills.
 * The original configuration is not changed.
 * 
 * This resolves a red screen TypeError: "console.assert is not a function"
 */
const replaceLegacyHaulPolyfills = (config) => {
  const removeLegacyHaulPolyfills = (config) => removeEntries(config, [
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]console\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]error-guard\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]polyfillEnvironment\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Number\.es6\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Object\.es6\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Object\.es7\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]String\.prototype\.es6\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Array\.prototype\.es6\.js/g,
    /haul[/\\]src[/\\]vendor[/\\]polyfills[/\\]Array\.es6\.js/g,
  ])

  const addReactNativePolyfills = (config) => addEntries(config, require('react-native/rn-get-polyfills')())

  return flow(
    removeLegacyHaulPolyfills,
    addReactNativePolyfills,
  )(config)
}

/**
 * Returns true if the specified value is a Webpack rule with at least one 'babel-loader' configured.
 */
const isBabelLoaderRule = (rule) => {
  const regex = /babel-loader/
  const isBabelLoaderEntry = (useEntry) => isString(useEntry) 
    ? regex.test(useEntry)
    : regex.test(get(useEntry, 'loader', ''))

  return some(castArray(get(rule, 'use', [])), isBabelLoaderEntry)
}

/**
 * Returns a Haul webpack config with the necessary configuration to use JSX in plain Javascript. The original 
 * configuration  not changed.
 * 
 * The configuration added by this function is:
 *   - resolve '.jsx' extensions
 *   - configure the Babel loader rule for '.jsx' files
 */
const addJsxSupport = (platform) => (config) => {
  const addTsconfigPathsPlugin = (config) => addResolvePlugin(config, createTsconfigPathsPlugin(config))
  
  const addJsxExtensions = (config) => addResolveExtensions(config, [
    '.jsx',
    `.${platform}.jsx`,
    '.native.jsx',
  ])

  const addJsxToBabelRule = (config) => expandRuleTests(config, /\.jsx$/, isBabelLoaderRule)

  return flow(
    addJsxExtensions,
    addJsxToBabelRule,
  )(config)
}

/**
 * Returns a Haul webpack config with the necessary configuration to use TypeScript. The original configuration
 * is not changed.
 * 
 * The configuration added by this function is:
 *   - resolve '.ts' and '.tsx' extensions
 *   - add a Babel loader rule for '.ts' and '.tsx' files
 *   - configure the TsconfigPathsPlugin resolve plugin
 */
const addTypeScriptSupport = (platform) => (config) => {
  const addTsconfigPathsPlugin = (config) => addResolvePlugin(config, createTsconfigPathsPlugin(config))
  
  const addTypescriptExtensions = (config) => addResolveExtensions(config, [
    '.ts',
    '.tsx',
    `.${platform}.ts`,
    '.native.ts',
    `.${platform}.tsx`,
    '.native.tsx',
  ])

  const addTypeScriptToBabelRule = (config) => expandRuleTests(config, /\.tsx?$/, isBabelLoaderRule)

  return flow(
    addTypescriptExtensions,
    addTypeScriptToBabelRule,
    addTsconfigPathsPlugin,
  )(config)
}

const logConfigToConsole = (config) => {
  console.log('Webpack Config:', JSON.stringify(config, null, 2))
  return config
}

export const fixWebpackConfig = (env, config) => {
  return flow(
    addJsxSupport(env.platform),
    addTypeScriptSupport(env.platform),
    replaceLegacyHaulPolyfills,
    logConfigToConsole,
  )(config)
}