import { ActionType, createAction } from 'typesafe-actions'

import { Area, Thing } from './state'

export const MapEvents = {
  areaCreated: createAction('map/area-created')<Area>(),
  areaRemoved: createAction('map/area-removed')<Area['id']>(),
  thingCreated: createAction('map/thing-created')<Thing>(),
  thingRemoved: createAction('map/thing-removed')<Thing['id']>(),
}

export type MapEvent = ActionType<typeof MapEvents>
