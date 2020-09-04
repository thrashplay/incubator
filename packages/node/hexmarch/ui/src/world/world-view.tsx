import React from 'react'

import { World } from '@thrashplay/hexmarch-model'

import { MapView } from '../map'

export interface WorldViewProps {
  world: World
}

export const WorldView = ({ world }: WorldViewProps) => (
  <MapView
    map={world.map}
    style={{ flex: 1 }}
  />
)
