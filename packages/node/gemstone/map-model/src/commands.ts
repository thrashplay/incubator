import { map } from 'lodash/fp'

import { Extents } from '@thrashplay/math'

import { buildRectangularRoom } from './builders/room'
import { buildEnclosingWalls, RectangleEnclosureSpecification } from './builders/wall'
import { MapEvents } from './events'

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
