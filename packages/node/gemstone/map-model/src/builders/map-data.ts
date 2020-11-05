import { flow, map } from 'lodash/fp'

import { addItem, createBuilder } from '@thrashplay/fp'

import { Area, MapData, Thing } from '../state'

export const buildMap = createBuilder((): MapData => ({
  areas: {},
  things: {},
}))

/** Add an Area (room, hallway, etc.) to a map */
const addArea = (area: Area) => (map: MapData) => ({ ...map, areas: addItem(map.areas, area) })

/** Add a Thing (in-game object) to a map */
const addThing = (thing: Thing) => (map: MapData) => ({ ...map, things: addItem(map.things, thing) })

/** Add multiple Things (in-game objects) to a map */
const addThings = (things: Thing[]) => (mapData: MapData) => flow(
  ...map(addThing)(things)
)(mapData)

export const MapBuilder = {
  addArea,
  addThing,
  addThings,
}
