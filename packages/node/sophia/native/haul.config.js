import path from 'path'

import { makeConfig, withPolyfills } from '@haul-bundler/preset-0.60'
import { get } from 'lodash'
import { castArray, concat, flow, isString, map, some, tap } from 'lodash/fp'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const WebpackHelpers = require('@thrashplay/webpack-utils').WebpackHelpers

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
export const addResolvePlugin = (plugin) => (config) => {
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
 * Returns true if the specified value is a Webpack rule with at least one 'babel-loader' configured.
 */
const isBabelLoaderRule = (rule) => {
  const regex = /babelWorkerLoader/
  const isBabelLoaderEntry = (useEntry) => isString(useEntry)
    ? regex.test(useEntry)
    : regex.test(get(useEntry, 'loader', ''))

  return some(isBabelLoaderEntry, castArray(get(rule, 'use', [])))
}

/**
 * Returns a transformed config that adds the specified exclusion to all Babel rule configurations.
 */
const addNodeModulesExclusion = (exclusion) => (config) => {
  const addExclusion = (rule) => ({
    ...rule,
    exclude: exclusion,
  })

  const addExclusionIfBabelRule = (rule) =>
    isBabelLoaderRule(rule)
      ? addExclusion(rule)
      : rule

  const originalModule = get(config, 'module')
  const originalRules = get(config, 'module.rules', [])

  return {
    ...config,
    module: {
      ...originalModule,
      rules: map(addExclusionIfBabelRule)(originalRules),
    },
  }
} 

const excludeSvgFromAssetLoader = (config) => {
  const isAssetLoaderRule = (rule) => {
    const regex = /assetLoader/
    const isAssetLoaderEntry = (useEntry) => isString(useEntry)
      ? regex.test(useEntry)
      : regex.test(get(useEntry, 'loader', ''))

    return some(isAssetLoaderEntry, castArray(get(rule, 'use', [])))
  }

  const addExclusion = (rule) => ({
    ...rule,
    exclude: /.*\.svg/,
  })

  const addExclusionIfAssetLoaderRule = (rule) =>
    isAssetLoaderRule(rule)
      ? addExclusion(rule)
      : rule

  const originalModule = get(config, 'module')
  const originalRules = get(config, 'module.rules', [])

  return {
    ...config,
    module: {
      ...originalModule,
      rules: map(addExclusionIfAssetLoaderRule)(originalRules),
    },
  }
}

const addLoaderConfigs = (loaderConfigs) => (config) => {
  return {
    ...config,
    module: {
      ...get(config, 'module', {}),
      rules: [
        ...loaderConfigs,
        ...get(config, 'module.rules', []),
      ],
    },
  }
}

export default makeConfig({
  bundles: {
    index: {
      entry: withPolyfills(path.resolve(__dirname, 'src', 'index.ts')),
      looseMode: [
        /node_modules[/\\]@react-native-community[/\\]masked-view/,
      ],
      root: path.resolve(__dirname, '..', '..', '..', '..'),
      transform: ({ config }) =>
        flow(
          addResolvePlugin(createTsconfigPathsPlugin(config, {
            configFile: path.resolve(__dirname, '..', '..', '..', '..', 'tsconfig.json'),
          })),
          excludeSvgFromAssetLoader,
          addLoaderConfigs(WebpackHelpers.getLoaderConfigs()),
          addNodeModulesExclusion(WebpackHelpers.getNodeModulesExclusion()),
          tap((config) => console.log('Final Webpack config:', JSON.stringify(config, null, 2)))
        )(config),
    },
  },
  server: {
    host: '0.0.0.0',
  },
})
