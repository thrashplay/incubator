import path from 'path'

import { filter, flatten, forEach, get, isArray, isNil, isObject, isString, map } from 'lodash'
import { withPolyfills, makeConfig } from '@haul-bundler/preset-0.60'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

// https://github.com/callstack/haul/blob/master/docs/Configuration.md

const addTsconfigPathsPlugin = (config, options = {}) => {
  config.resolve.plugins = [
    ...config.resolve.plugins,
    new TsconfigPathsPlugin({
      extensions: config.resolve.extensions,
      mainFields: config.resolve.mainFields,
      ...options,
    }),
  ]
}

const isBabelWorkerLoaderUseEntry = (use) => {
  const loader = get(use, 'loader', '')
  console.log('checking:', loader)
  return /babelWorkerLoader/.test(loader)
}

const findBabelWorkerLoaderRuleUseEntries = (config) => {
  const rulesWithUseEntries = filter(get(config, 'module.rules', []), (rule) => isArray(rule.use) || isObject(rule.use))
  const allUseEntries = flatten(map(rulesWithUseEntries, (rule) => isArray(rule.use) ? rule.use : [rule.use]))
  return filter(allUseEntries, isBabelWorkerLoaderUseEntry)
}

export default makeConfig({
  bundles: {
    index: {
      root: path.resolve(__dirname, '..', '..'),
      entry: withPolyfills(path.resolve(__dirname, 'src', 'index.ts')),
      transform: ({ config, runtime }) => {
        // configureTsLoader(config)
        // config.context = path.resolve(__dirname, '..'),
        addTsconfigPathsPlugin(config)

        const babelWorkerLoaderRuleUseEntries = findBabelWorkerLoaderRuleUseEntries(config)
        forEach(babelWorkerLoaderRuleUseEntries, (entry) => {
          if (!isNil(entry.options)) {
            delete entry.options.cacheDirectory
          }
        })
      
        runtime.logger.info('config:', JSON.stringify(config, null, 2))
      },
    },
  },
})
