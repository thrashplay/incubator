import { getType } from 'typesafe-actions'

import { CommonEvent, CommonEvents } from '../common'

import { buildCharacterRecords, CharacterRecordsBuilder } from './builders'
import { CharacterEvent, CharacterEvents } from './events'
import { CharacterRecordSet } from './state'

const { addCharacter, removeCharacter } = CharacterRecordsBuilder

export const reduceCharacterState = (
  state: CharacterRecordSet, event: CharacterEvent | CommonEvent
): CharacterRecordSet => {
  switch (event.type) {
    case getType(CommonEvents.initialized):
      return buildCharacterRecords()

    case getType(CharacterEvents.characterCreated):
      return addCharacter(event.payload)(state)

    case getType(CharacterEvents.characterRemoved):
      return removeCharacter(event.payload)(state)

    default:
      return state
  }
}
