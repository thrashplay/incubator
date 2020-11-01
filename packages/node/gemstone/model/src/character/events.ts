import { ActionType, createAction } from 'typesafe-actions'

import { Character, CharacterId } from './state'

export const CharacterEvents = {
  characterCreated: createAction('character/created')<Character>(),
  characterRemoved: createAction('character/removed')<CharacterId>(),
}

export type CharacterEvent = ActionType<typeof CharacterEvents>
