const path = require('path')

const HtmlWebPackPlugin = require('html-webpack-plugin')

const createWebpackBase = require('@thrashplay/webpack-utils').createWebpackBase

const htmlPlugin = new HtmlWebPackPlugin({
  filename: './index.html',
  hash: true,
  template: './src/template.html',
})

module.exports = (env, options) => {
  const baseConfig = createWebpackBase(env, options)
  const isProduction = options.mode === 'production'

  return {
    ...baseConfig,
    name: 'application',
    entry: './src/index.tsx',
    mode: 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: 'application.js',
    },
    plugins: isProduction
      ? [
        ...baseConfig.plugins,
        htmlPlugin,
      ]
      : baseConfig.plugins,
    devServer: {
      contentBase: path.join(__dirname, 'dev/'),
      port: 3000,
      publicPath: 'http://localhost:3000/dist/',
      hotOnly: true,
    },
    // see https://webpack.js.org/configuration/devtool/ for options
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
  }
}
