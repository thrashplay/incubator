
import { createBuilder } from '@thrashplay/fp'
import { Extents } from '@thrashplay/math'

import { Area } from '../state'

import { getNextAreaId } from './get-next-area-id'

// Room Builders

export interface RoomSpecification {
  bounds: Extents
}

/** Builds a rectangular room area with the specified bounds */
export const buildRectangularRoom = createBuilder(({ bounds }: RoomSpecification): Area => ({
  id: getNextAreaId(),
  bounds,
  things: [],
}))

/** Updates a room area with new values */
const set = (values: Partial<Area>) => (initial: Area) => ({ ...initial, ...values })

export const RoomBuilder = {
  set,
}
