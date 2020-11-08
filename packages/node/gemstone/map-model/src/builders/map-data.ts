import { flow, map } from 'lodash/fp'

import { addItem, BuilderFunction, createBuilder, removeItem, updateItem } from '@thrashplay/fp'

import { Area, MapData, Thing } from '../state'

export const buildMap = createBuilder((): MapData => ({
  areas: {},
  things: {},
}))

/** Creates a state object for the given map that can be used with selectors. */
export const forMapSelector = (mapData: MapData) => ({ map: mapData })

/** Add an Area (room, hallway, etc.) to a map */
const addArea = (area: Area) => (map: MapData) => ({ ...map, areas: addItem(map.areas, area) })

/** Remove an Area (room, hallway, etc.) from a map */
const removeArea = (id: string) => (map: MapData) => ({ ...map, areas: removeItem(map.areas, id) })

/** Applies one or more update functions to an area */
const updateArea = (
  id: Area['id'],
  ...updaters: BuilderFunction<Area>[]
) => (map: MapData) => ({ ...map, areas: updateItem(map.areas, id, ...updaters) })

/** Add a Thing (in-game object) to a map */
const addThing = (thing: Thing) => (map: MapData) => ({ ...map, things: addItem(map.things, thing) })

/** Add multiple Things (in-game objects) to a map */
const addThings = (things: Thing[]) => (mapData: MapData) => flow(
  ...map(addThing)(things)
)(mapData)

/** Removes a Thing (in-game object) from a map */
const removeThing = (id: Thing['id']) => (map: MapData) => ({ ...map, things: removeItem(map.things, id) })

export const MapBuilder = {
  addArea,
  addThing,
  addThings,
  removeArea,
  removeThing,
  updateArea,
}
