import { flow, get, map } from 'lodash/fp'

import { addItem, BuilderFunction, createBuilder, removeItem, updateItem } from '@thrashplay/fp'
import { Extents, Point } from '@thrashplay/math'

import { Area, MapData, Thing } from '../state'
import { isWall } from '../things/predicates'
import { Wall } from '../things/wall'

import { buildRectangularArea, buildRectangularRoom } from './rooms'
import { buildEnclosingWalls, buildPassageWalls } from './walls'

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

/**
 * Updates a wall with the given ThingID by using a number of builder functions.
 * If the thing ID does not reference an existing thing, with 'kind == "wall"', the state is not changed.
 */
const updateWall = (
  id: Thing['id'],
  ...updaters: BuilderFunction<Wall>[]
) => (mapData: MapData) => !isWall(mapData.things[id])
  ? mapData
  : {
    ...mapData,
    // we take wall builders, but pass in things.. should be safe because of our check above, but tsc doesn't know that
    things: updateItem(mapData.things, id, ...updaters as any),
  }

/**
 * Adds a rectangular room, and the walls enclosing it, to a map.
 * Optionally specify a list of builder functions that can be used to enhance the 'Area' created for the room.
 **/
const addRectangularRoom = (
  bounds: Extents,
  wallThickness = 1,
  ...roomBuilderFunctions: BuilderFunction<Area>[]
) => (mapData: MapData) => {
  const walls = buildEnclosingWalls({ bounds, wallThickness })

  const getWallId = (wall: Thing) => wall.id

  return flow(
    ...map(addThing)(walls),
    addArea(buildRectangularRoom({ bounds, wallIds: map(getWallId)(walls) }, ...roomBuilderFunctions))
  )(mapData)
}

/**
 * Adds a passage, and the walls enclosing it, to a map.
 * Optionally specify a list of builder functions that can be used to enhance the 'Area' created for the room.
 **/
const addPassage = (
  start: Point,
  end: Point,
  width = 5,
  wallThickness = 1,
  ...roomBuilderFunctions: BuilderFunction<Area>[]
) => (mapData: MapData) => {
  const walls = buildPassageWalls({ p1: start, p2: end, wallThickness, width })

  const getWallId = (wall: Thing) => wall.id

  const bounds = {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: start.x === end.x ? width : Math.abs(end.x - start.x),
    height: start.x === end.x ? Math.abs(end.y - start.y) : width,
  }

  return flow(
    ...map(addThing)(walls),
    addArea(buildRectangularArea({ bounds, kind: 'passage', wallIds: map(getWallId)(walls) }, ...roomBuilderFunctions))
  )(mapData)
}

export const MapBuilder = {
  addArea,
  addRectangularRoom,
  addThing,
  addThings,
  removeArea,
  removeThing,
  setOnThing: (values: Partial<Thing>) => (initial: Thing) => ({ ...initial, ...values }),
  updateArea,
  updateWall,
}
