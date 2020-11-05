import { ActionType, createAction } from 'typesafe-actions'

import { Area } from './state'

export const MapEvents = {
  areaCreated: createAction('map/area-created')<Area>(),
  areaRemoved: createAction('map/area-removed')<string>(),
}

export type MapEvent = ActionType<typeof MapEvents>
