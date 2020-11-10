import { ActionType, createAction } from 'typesafe-actions'

import { Extents } from '@thrashplay/math'

import { Area, Thing } from './state'

export interface RectangularRoomDetails {
  /** Dimensions of a room, in feet */
  bounds: Extents

  /** the ID for the new room */
  id: Area['id']

  /** Thickness of the walls, in feet (defaults to 1) */
  wallThickness?: number
}

export const MapEvents = {
  areaCreated: createAction('map/area-created')<Area>(),
  areaRemoved: createAction('map/area-removed')<Area['id']>(),

  /** Creates a break at the given position in a wall, with the specified length (in feet). */
  passageAdded: createAction('map/passage-added')<{ wallId: Thing['id']; length: number; position: number }>(),

  rectangularPassageCreated: createAction('map/rectangular-passage-created')<RectangularRoomDetails>(),
  rectangularRoomCreated: createAction('map/rectangular-room-created')<RectangularRoomDetails>(),
  thingCreated: createAction('map/thing-created')<Thing>(),
  thingRemoved: createAction('map/thing-removed')<Thing['id']>(),
}

export type MapEvent = ActionType<typeof MapEvents>
