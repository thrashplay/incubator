import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '@thrashplay/gemstone-model'

import { buildMap, MapBuilder } from './builders/map-data'
import { WallBuilder } from './builders/walls'
import { MapEvent, MapEvents } from './events'
import { MapData } from './state'

const DEFAULT_MAP = buildMap()

const { addArea, addRectangularRoom, addThing, removeArea, removeThing, updateWall } = MapBuilder
const { addBreak } = WallBuilder

export const reduceMapState = (state: MapData, event: MapEvent | CommonEvent): MapData => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return DEFAULT_MAP

    case getType(MapEvents.areaCreated):
      return addArea(event.payload)(state)

    case getType(MapEvents.areaRemoved):
      return removeArea(event.payload)(state)

    case getType(MapEvents.passageAdded):
      return updateWall(event.payload.wallId, addBreak({
        kind: 'passage',
        position: event.payload.position,
        length: event.payload.length,
      }))(state)

    case getType(MapEvents.rectangularRoomCreated):
      return addRectangularRoom(event.payload.bounds, event.payload.wallThickness ?? 1)(state)

    case getType(MapEvents.thingCreated):
      return addThing(event.payload)(state)

    case getType(MapEvents.thingRemoved):
      return removeThing(event.payload)(state)

    default:
      return state
  }
}
