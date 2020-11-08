import { flow } from 'lodash'
import { get, map } from 'lodash/fp'

import { createBuilder } from '@thrashplay/fp'
import { Extents } from '@thrashplay/math'

import { Area, MapData } from '../state'
import { Wall } from '../things/wall'

import { getNextAreaId } from './get-next-area-id'
import { MapBuilder } from './map-data'
import { buildWall } from './wall'

const { addArea, addThing } = MapBuilder

// Room Builders

export interface RoomSpecification {
  bounds: Extents
  walls: Wall[]
}

const horizontalWall = (x1: number, x2: number, y: number) => buildWall({
  start: { x: x1, y },
  end: { x: x2, y },
  thickness: 5,
})

const verticalWall = (x: number, y1: number, y2: number) => buildWall({
  start: { x: x, y: y1 },
  end: { x: x, y: y2 },
})

/** Builds a rectangular room area with the specified bounds */
export const buildRectangularRoom = createBuilder(({ bounds, walls }: RoomSpecification): Area => ({
  id: getNextAreaId(),
  bounds,
  things: map(get('id'))(walls),
}))

export const addRectangularRoom = (bounds: Extents) => (mapData: MapData) => {
  const north = horizontalWall(bounds.x + bounds.width, bounds.x, bounds.y)
  const west = verticalWall(bounds.x, bounds.y, bounds.y + bounds.height)
  const south = horizontalWall(bounds.x, bounds.x + bounds.width, bounds.y + bounds.height)
  const east = verticalWall(bounds.x + bounds.width, bounds.y + bounds.height, bounds.y)

  return flow(
    addThing(north),
    addThing(west),
    addThing(south),
    addThing(east),
    addArea(buildRectangularRoom({ bounds, walls: [north, west, south, east] }))
  )(mapData)
}

/** Updates a room area with new values */
const set = (values: Partial<Area>) => (initial: Area) => ({ ...initial, ...values })

export const RoomBuilder = {
  set,
}
