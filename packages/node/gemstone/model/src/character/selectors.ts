import { values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { createParameterSelector } from '../common'

import { CharacterId, CharacterStateContainer } from './state'

export interface CharacterSelectorParameters {
  characterId?: CharacterId
}

const getCharacterIdParam = createParameterSelector((params?: CharacterSelectorParameters) => params?.characterId)

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

/** gets a character's actual name */
export const getPlayerCharacterName = createSelector(
  [getPlayerCharacter],
  (character) => character?.name ?? 'an unknown character'
)

/** gets a character's public-facing name for players (may or may not be their actual name) */
export const getPublicCharacterName = createSelector(
  [getPlayerCharacter],
  (character) => character?.name ?? 'an unknown character'
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
