import { Extents } from '@thrashplay/math'

import { buildSquareRoom } from './builders/room'
import { MapEvents } from './events'

/** Add a square room to the map. */
export const createSquareRoom = (
  bounds: Extents
) => () => MapEvents.areaCreated(buildSquareRoom(bounds))
