import { CombatMapEvent, CombatMapState } from './state'

export const reducer = (state: CombatMapState, event: CombatMapEvent): CombatMapState => {
  switch (event.type) {
    case 'set-highlights':
      return {
        ...state,
        highlights: event.payload,
      }

    default:
      return state
  }
}
