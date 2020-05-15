const path = require('path')

// From: https://github.com/webpack/webpack/issues/2031#issuecomment-317589620
const excludeNodeModulesExcept = (modules) => {
  let pathSep = path.sep
  if (pathSep === '\\') { // must be quoted for use in a regexp:
    pathSep = '\\\\'
  }
  const moduleRegExps = modules.map(function (modName) {
    return new RegExp('node_modules' + pathSep + modName)
  })

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (let i = 0; i < moduleRegExps.length; i++) {
        if (moduleRegExps[i].test(modulePath)) return false
      }
      return true
    }
    return false
  }
}

const getNodeModulesExclusion = () => excludeNodeModulesExcept([
  '@react-native-community.*',
  '@react-navigation.*',
  '@unimodules',
  'expo-asset',
  'expo-gl',
  'react-native',
  'react-native-.*',
])

const getLoaderConfigs = (_isProduction) => {
  return [
    {
      test: /\.frag$/,
      use: 'raw-loader',
    },
    {
      test: /\.ttf$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
          },
        },
      ],
    },
    {
      test: /\.svg$/,
      exclude: /node_modules/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            native: true,
          },
        },
      ],
    },
  ]
}

module.exports = {
  getLoaderConfigs,
  getNodeModulesExclusion,
}
