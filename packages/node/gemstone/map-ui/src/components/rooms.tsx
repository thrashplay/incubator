import { map, values } from 'lodash/fp'
import React from 'react'

import { Area } from '@thrashplay/gemstone-map-model'
import { useStore } from '@thrashplay/gemstone-ui-core'

import { AreaShape } from './area-shape'

export const AreasRenderer = () => {
  const areas = useStore().getState().map.areas

  const getAreaView = (area: Area) => (
    <AreaShape key={area.id}
      area={area}
      fill="white"
    />
  )

  return <>{map(getAreaView)(values(areas))}</>
}
