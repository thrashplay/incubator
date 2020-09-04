import React from 'react'
import { MapView, HexGrid } from '@thrashplay/hexmarch-ui'
import { View } from 'react-native'

import { storiesOf } from '../../stories-of'

storiesOf('MapView', module)
  .add('default', () => (
    <HexGrid style={{ height: '100vh' }}/>
  ))
