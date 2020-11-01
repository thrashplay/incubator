import { CharacterEvents } from './events'
import { Character, CharacterId } from './state'

/** a character was added to the game */
export const addCharacter = (
  character: Character
) => () => CharacterEvents.characterCreated(character)

/** a character was removed from the game */
export const removeCharacter = (
  characterId: CharacterId
) => () => CharacterEvents.characterRemoved(characterId)
