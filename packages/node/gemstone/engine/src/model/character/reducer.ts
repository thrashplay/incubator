import { pickBy } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { CommonAction, CommonActions } from '../common/action'

import { CharacterAction, CharacterActions } from './actions'
import { CharacterState } from './state'

export const reduceCharacterState = (
  state: CharacterState, action: CharacterAction | CommonAction
): CharacterState => {
  switch (action.type) {
    case getType(CommonActions.initialized):
      return {
        pcs: {},
      }

    case getType(CharacterActions.characterCreated):
      return {
        ...state,
        pcs: {
          ...state.pcs,
          [action.payload.id]: action.payload,
        },
      }

    case getType(CharacterActions.characterRemoved):
      return {
        ...state,
        pcs: pickBy((_: any, key: string) => key !== action.payload)(state.pcs),
      }

    default:
      return state
  }
}
