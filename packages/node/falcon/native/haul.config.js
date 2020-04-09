import path from 'path'

import { withPolyfills, makeConfig } from '@haul-bundler/preset-0.60'
import { concat, get } from 'lodash'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

export const createTsconfigPathsPlugin = (config, options = {}) => {
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

export default makeConfig({
  bundles: {
    index: {
      entry: withPolyfills(path.resolve(__dirname, 'src', 'index.ts')),
      root: path.resolve(__dirname, '..', '..'),
      transform: ({ config, runtime }) => {
        return addResolvePlugin(config, createTsconfigPathsPlugin(config))
      },
    },
  },
})
