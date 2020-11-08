import { map } from 'lodash/fp'

import {
  buildEnclosingWalls,
  buildRectangularRoom,
  MapEvents,
  RectangleEnclosureSpecification,
  Thing,
} from '@thrashplay/gemstone-map-model'
import { Extents } from '@thrashplay/math'

import { GameState } from '../..'

export interface RoomDefinition {
  /** Size of the room's interior, not including walls. */
  bounds: Extents

  /** Thickness of the room's containing walls, in feet (defaults to 1). */
  wallThickness?: number
}

/** Adds a rectangular room to the map. */
export const createRectangularRoom = (specification: RectangleEnclosureSpecification) => () => {
  const walls = buildEnclosingWalls(specification)

  return [
    ...map(MapEvents.thingCreated)(walls),
    MapEvents.areaCreated(buildRectangularRoom({
      bounds: specification.bounds,
      walls,
    })),
  ]
}

/**
 * Creates a gap in the center of a wall, with the specified length.
 *
 * The gap is created by removing the original wall, and replacing it with two new walls that fall
 * on either side of the gap.
 *
 * TODO: allow the gap to be placed along the all, but not in the center
 */
export const createWallGap = (wallId: Thing['id'], length: number) => (state: GameState) => {

}
