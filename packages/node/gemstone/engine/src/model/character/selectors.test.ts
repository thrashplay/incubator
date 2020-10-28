import { CharacterFixtures, CharacterStateFixtures, stateWithCharacters } from './__fixtures__'
import { getPlayerCharacter, getPlayerCharacters } from './selectors'
import { Character, CharacterId, CharacterStateContainer } from './state'

const { Gimli, Trogdor } = CharacterFixtures
const { Default } = CharacterStateFixtures

const state: CharacterStateContainer = {
  characters: stateWithCharacters(Gimli, Trogdor),
}

const emptyState: CharacterStateContainer = {
  characters: Default,
}

const invalidState = { } as unknown as CharacterStateContainer

describe('character selectors', () => {
  describe('getPlayerCharacter', () => {
    it('returns undefined if no character state', () => {
      expect(getPlayerCharacter(invalidState, {})).toBeUndefined()
    })

    it('returns undefined if no ID specified', () => {
      expect(getPlayerCharacter(state, {})).toBeUndefined()
    })

    it.each<[CharacterId, Character]>([
      ['gimli', Gimli],
      ['trogdor', Trogdor],
    ])('returns correct character: %p', (id, character) => {
      expect(getPlayerCharacter(state, { characterId: id })).toStrictEqual(character)
    })

    it('returns undefined if character does not exist', () => {
      expect(getPlayerCharacter(state, { characterId: 'invalid-id' })).toBeUndefined()
    })
  })

  describe('getPlayerCharacters', () => {
    it('returns empty array if no character state', () => {
      expect(getPlayerCharacters(invalidState)).toStrictEqual([])
    })

    it('returns empty array if no characters', () => {
      expect(getPlayerCharacters(emptyState)).toStrictEqual([])
    })

    it('returns array containing correct characters', () => {
      const result = getPlayerCharacters(state)
      expect(result).toHaveLength(2)
      expect(result).toContain(Gimli)
      expect(result).toContain(Trogdor)
    })
  })
})
