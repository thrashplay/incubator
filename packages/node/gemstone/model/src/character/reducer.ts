import { pickBy } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '../common'

import { CharacterEvent, CharacterEvents } from './events'
import { CharacterState } from './state'

export const reduceCharacterState = (
  state: CharacterState, event: CharacterEvent | CommonEvent
): CharacterState => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return {
        pcs: {},
      }

    case getType(CharacterEvents.characterCreated):
      return {
        ...state,
        pcs: {
          ...state.pcs,
          [event.payload.id]: event.payload,
        },
      }

    case getType(CharacterEvents.characterRemoved):
      return {
        ...state,
        pcs: pickBy((_: any, key: string) => key !== event.payload)(state.pcs),
      }

    default:
      return state
  }
}
