const webpackBase = require('./webpack-base')

module.exports = {
  createWebpackBase: webpackBase.createWebpackBase,
  WebpackBase: webpackBase.WebpackBase,
  WebpackHelpers: require('./webpack-helpers'),
}
