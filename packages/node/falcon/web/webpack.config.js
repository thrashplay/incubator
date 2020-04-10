const path = require('path')

const haulPreset = require('@haul-bundler/preset-0.60')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const webpack = require('webpack')

const RESOLVE_EXTENSIONS = ['*', '.ts', '.tsx', '.js', '.jsx']
 
// From: https://github.com/webpack/webpack/issues/2031#issuecomment-317589620
const excludeNodeModulesExcept = (modules) => {
  var pathSep = path.sep
  if (pathSep == '\\') // must be quoted for use in a regexp:
    pathSep = '\\\\'
  var moduleRegExps = modules.map (function (modName) { return new RegExp('node_modules' + pathSep + modName)})

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (var i = 0; i < moduleRegExps.length; i ++)
        if (moduleRegExps[i].test(modulePath)) return false
      return true
    }
    return false
  }
}

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: excludeNodeModulesExcept([
          'react-native',
          'react-native-swipe-gestures',
          'react-native-dev-menu',
        ]),
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'react-native-web-image-loader?name=[hash].[ext]',
          },
        ],
      },
    ],
  },
  resolve: { 
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: RESOLVE_EXTENSIONS,
    plugins: [
      new TsconfigPathsPlugin({
        extensions: RESOLVE_EXTENSIONS,
      }),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    port: 3000,
    publicPath: 'http://localhost:3000/dist/',
    hotOnly: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
}