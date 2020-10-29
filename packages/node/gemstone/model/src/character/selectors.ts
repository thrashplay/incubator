import { values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { createParameterSelector } from '../common'

import { CharacterId, CharacterStateContainer } from './state'

export interface CharacterSelectorParameters {
  characterId?: CharacterId
}

const getCharacterIdParam = createParameterSelector((params: CharacterSelectorParameters) => params.characterId)

/** character selectors */
export const getCharactersState = (state: CharacterStateContainer) => state.characters ?? { }

export const getPlayerCharactersCollection = createSelector(
  [getCharactersState],
  (state) => state.pcs ?? { }
)

/** gets a character by ID */
export const getPlayerCharacter = createSelector(
  [getPlayerCharactersCollection, getCharacterIdParam],
  (characters, id) => id === undefined ? undefined : characters[id]
)

export const getBaseSpeed = createSelector(
  [getPlayerCharactersCollection, getCharacterIdParam],
  (characters, id) => id === undefined ? 0 : characters[id]?.speed ?? 0
)

/** retrieves an unsorted array of all player characters */
export const getPlayerCharacters = createSelector(
  [getPlayerCharactersCollection],
  (characters) => values(characters)
)
