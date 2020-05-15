const path = require('path')

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const webpack = require('webpack')

const WebpackHelpers = require('./webpack-helpers')

const RESOLVE_EXTENSIONS = ['*', '.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.web.jsx', '.jsx']

const createWebpackBase = (env, options) => {
  const isProduction = options.mode === 'production'

  return {
    mode: 'development',
    module: {
      rules: [
        ...WebpackHelpers.getLoaderConfigs(isProduction),
        {
          test: /\.(j|t)sx?$/,
          exclude: WebpackHelpers.getNodeModulesExclusion(),
          use: [
            {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward',
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          use: [
            {
              loader: 'react-native-web-image-loader?name=[name].[hash:8].[ext]',
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: [
            {
              loader: '@svgr/webpack',
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
    plugins: isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  }
}

module.exports = {
  createWebpackBase,
  WebpackBase: createWebpackBase({ }, {
    mode: 'development',
  }),
}
