import { getNextAreaId, MapEvents } from '@thrashplay/gemstone-map-model'
import { Extents } from '@thrashplay/math'

/** Adds a rectangular room to the map. */
export const createRectangularRoom = (bounds: Extents, wallThickness = 1, id = getNextAreaId()) => () => {
  return [
    MapEvents.rectangularRoomCreated({ bounds, id, wallThickness }),
  ]
}
