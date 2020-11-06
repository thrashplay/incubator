import { ActionType, createAction, getType } from 'typesafe-actions'

import { Actor } from '@thrashplay/gemstone-model'
import { Dimensions, Extents } from '@thrashplay/math'

import { CombatViewState } from './state'

export const CombatViewEvents = {
  actorSelected: createAction('map-view/actor-selected')<Actor['id'] | undefined>(),
  extentsChanged: createAction('map-view/extents-changed')<Extents>(),
  toolSelected: createAction('map-view/tool-selected')<string>(),
  viewportChanged: createAction('map-view/viewport-changed')<Dimensions | undefined>(),
}

export type CombatViewEvent = ActionType<typeof CombatViewEvents>

export const reducer = (state: CombatViewState, event: CombatViewEvent): CombatViewState => {
  switch (event.type) {
    case getType(CombatViewEvents.actorSelected):
      return {
        ...state,
        selectedActorId: event.payload,
      }

    case getType(CombatViewEvents.extentsChanged):
      return {
        ...state,
        extents: event.payload,
      }

    case getType(CombatViewEvents.toolSelected):
      return {
        ...state,
        selectedToolId: event.payload,
      }

    case getType(CombatViewEvents.viewportChanged):
      return {
        ...state,
        viewport: event.payload,
      }

    default:
      return state
  }
}
