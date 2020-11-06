import { getType } from 'typesafe-actions'

import { CombatViewEvent, CombatViewEvents } from './events'
import { CombatViewState } from './state'

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
