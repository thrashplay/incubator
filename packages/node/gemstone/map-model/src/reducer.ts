import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '@thrashplay/gemstone-model'

import { buildMap, MapBuilder } from './builders/map-data'
import { MapEvent, MapEvents } from './events'
import { MapData } from './state'

const DEFAULT_MAP = buildMap()

const { addArea, addThing, removeArea, removeThing } = MapBuilder

export const reduceMapState = (state: MapData, event: MapEvent | CommonEvent): MapData => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return DEFAULT_MAP

    case getType(MapEvents.areaCreated):
      return addArea(event.payload)(state)

    case getType(MapEvents.areaRemoved):
      return removeArea(event.payload)(state)

    case getType(MapEvents.thingCreated):
      return addThing(event.payload)(state)

    case getType(MapEvents.thingRemoved):
      return removeThing(event.payload)(state)

    default:
      return state
  }
}
