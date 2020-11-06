import { ActionType, createAction } from 'typesafe-actions'

import { Actor } from '@thrashplay/gemstone-model'
import { Dimensions, Extents } from '@thrashplay/math'

export const CombatViewEvents = {
  actorSelected: createAction('map-view/actor-selected')<Actor['id'] | undefined>(),
  extentsChanged: createAction('map-view/extents-changed')<Extents>(),
  toolSelected: createAction('map-view/tool-selected')<string>(),
  viewportChanged: createAction('map-view/viewport-changed')<Dimensions | undefined>(),
}

export type CombatViewEvent = ActionType<typeof CombatViewEvents>
