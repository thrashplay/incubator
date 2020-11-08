import { MapEvents } from '@thrashplay/gemstone-map-model'
import { Extents } from '@thrashplay/math'

/** Adds a rectangular room to the map. */
export const createRectangularRoom = (bounds: Extents, wallThickness = 1) => () => {
  return [
    MapEvents.rectangularRoomCreated({ bounds, wallThickness }),
  ]
}
