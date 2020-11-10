import { createBuilder } from '@thrashplay/fp'
import { Extents } from '@thrashplay/math'

import { getNextAreaId } from '../selectors'
import { Area, Thing } from '../state'

// Room Builders

export interface AreaSpecification {
  bounds: Extents
  id?: Area['id']
  kind: Area['kind']
  wallIds: Thing['id'][]
}

export type RoomSpecification = Omit<AreaSpecification, 'kind'>

/** Builds a rectangular area with the specified bounds */
export const buildRectangularArea = createBuilder(({ bounds, id, kind, wallIds }: AreaSpecification): Area => ({
  id: id ?? getNextAreaId(),
  bounds,
  kind,
  things: [],
  wallIds,
}))

/** Builds a rectangular room area with the specified bounds */
export const buildRectangularRoom = createBuilder((specification: RoomSpecification): Area => buildRectangularArea({
  ...specification,
  kind: 'room',
}))

/** Updates a room area with new values */
const set = (values: Partial<Area>) => (initial: Area) => ({ ...initial, ...values })

export const RoomBuilder = {
  set,
}
