import path from 'path'

import { createWebpackConfig } from 'haul'
import { fixWebpackConfig } from '@ringlet/haul-config-helpers'

export default {
  webpack: (env) => {
    const config = createWebpackConfig({
      entry: './src/index.ts',
    })(env)

    config.resolve.alias = {
      '@thrashplay/genotype-components': path.resolve(__dirname, '..', 'components', 'src'),
      '@thrashplay/genotype-storybook': path.resolve(__dirname, '..', 'storybook', 'src'),
    }

    return fixWebpackConfig(env, config)
  },
}
