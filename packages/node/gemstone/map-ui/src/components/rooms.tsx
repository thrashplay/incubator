import { map, values } from 'lodash/fp'
import React from 'react'
import { G, Rect } from 'react-native-svg'

import { Area, Thing, Wall } from '@thrashplay/gemstone-model'
import { useStore } from '@thrashplay/gemstone-ui-core'

export const AreasRenderer = () => {
  const areas = useStore().getState().map.areas

  const getAreaView = ({ bounds, id }: Area) => (
    <G key={id}>
      <Rect
        {...bounds}
        fill="white"
      />
    </G>
  )

  return <>{map(getAreaView)(values(areas))}</>
}
