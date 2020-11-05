import { map, values } from 'lodash/fp'
import React from 'react'

import { Thing, Wall } from '@thrashplay/gemstone-model'
import { useStore } from '@thrashplay/gemstone-ui-core'

import { WallView } from './thing-views/wall-view'

export const Things = () => {
  const things = useStore().getState().map.things

  const getThingView = (thing: Thing) => thing.kind !== 'wall' ? null : (
    <WallView key={thing.id} wall={thing as Wall}/>
  )

  return <>{map(getThingView)(values(things))}</>
}
