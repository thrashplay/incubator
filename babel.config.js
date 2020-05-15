module.exports = (api) => {
  return {
    plugins: [
      'dev-expression',
      'react-native-paper/babel', // prod only?
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: 3,
          modules: api.env('test') ? 'commonjs' : false,
          debug: false,
          targets: {
            node: 'current',
          },
          useBuiltIns: 'usage',
        },
      ],
      '@haul-bundler/react-native',
    ],
  }
}
