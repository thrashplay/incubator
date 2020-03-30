import 'haul/hot/patch'
import { clearCacheFor, makeHot, redraw } from 'haul/hot'
import { AppRegistry } from 'react-native'
import { YellowBox } from 'react-native'

import Root from './Root'

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps has been renamed, and is not recommended for use.',
])

require('RCTNativeAppEventEmitter')

AppRegistry.registerComponent('Genotype', makeHot(() => Root))

if (module.hot) {
  module.hot.accept(() => {})
  module.hot.accept('./Root', () => {
    clearCacheFor(require.resolve('./Root'))
    redraw(() => require('./Root').default)
  })
}
