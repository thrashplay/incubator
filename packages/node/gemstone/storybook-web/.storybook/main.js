const baseConfig = require('@thrashplay/webpack-utils').WebpackBase

const configureWebpack = (config) => {
  const result = {
    ...config,
    module: {
      ...config.module,
      rules: baseConfig.module.rules,
    },
    resolve: {
      ...config.resolve,
      ...baseConfig.resolve,
    }
  }

  return result
}

module.exports = {
  stories: ['../../storybook/src/stories/**/*.story.jsx'],
  webpackFinal: configureWebpack,
};