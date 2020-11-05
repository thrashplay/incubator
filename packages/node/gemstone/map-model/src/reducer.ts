import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '@thrashplay/gemstone-model'

import { buildMap, MapBuilder } from './builders/map-data'
import { buildSquareRoom } from './builders/room'
import { MapData } from './state'

const { addArea } = MapBuilder

const DEFAULT_MAP = buildMap(
  addArea(buildSquareRoom({ width: 500, height: 150 }))
)

export const reduceMapState = (state: MapData, event: CommonEvent): MapData => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return DEFAULT_MAP

    default:
      return state
  }
}
