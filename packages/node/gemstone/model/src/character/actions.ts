import { ActionType, createAction } from 'typesafe-actions'

import { Character, CharacterId } from './state'

export const CharacterActions = {
  characterCreated: createAction('character/created')<Character>(),
  characterRemoved: createAction('character/removed')<CharacterId>(),
}

export type CharacterAction = ActionType<typeof CharacterActions>
