import { CharacterActions } from './actions'
import { Character, CharacterId } from './state'

/** a character was added to the game */
export const addCharacter = (
  character: Character
) => () => CharacterActions.characterCreated(character)

/** a character was removed from the game */
export const removeCharacter = (
  characterId: CharacterId
) => () => CharacterActions.characterRemoved(characterId)
