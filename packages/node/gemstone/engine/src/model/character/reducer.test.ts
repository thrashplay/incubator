import { CommonActions } from '../common/action'

import { CharacterFixtures, CharacterStateFixtures, stateWithCharacters } from './__fixtures__'
import { CharacterActions } from './actions'
import { reduceCharacterState } from './reducer'
import { Character, CharacterState } from './state'

const { Gimli, Trogdor } = CharacterFixtures
const { Default } = CharacterStateFixtures

const stateWithGimli = stateWithCharacters(Gimli)
const stateWithTrogdor = stateWithCharacters(Trogdor)
const stateWithGimliAndTrogdor = stateWithCharacters(Gimli, Trogdor)

describe('reduceCharacterState', () => {
  describe('CommonActions.initialized', () => {
    it('returns default state', () => {
      const result = reduceCharacterState('any value' as unknown as CharacterState, CommonActions.initialized())
      expect(result).toStrictEqual(Default)
    })
  })

  describe('CharacterActions.characterAdded', () => {
    it('adds character to PCs list', () => {
      const result = reduceCharacterState(stateWithTrogdor, CharacterActions.characterCreated(Gimli))
      expect(result).toEqual(stateWithGimliAndTrogdor)
    })

    it('overrides existing character, if one', () => {
      const mirrorTrogdor: Character = {
        id: 'trogdor',
        name: 'Trogdor, the Coldinator',
        speed: 120,
      }

      const result = reduceCharacterState(stateWithGimliAndTrogdor, CharacterActions.characterCreated(mirrorTrogdor))
      expect(result).toEqual(stateWithCharacters(Gimli, mirrorTrogdor))
    })
  })

  describe('CharacterActions.characterRemoved', () => {
    it('removes character from PCs list', () => {
      const result = reduceCharacterState(stateWithGimliAndTrogdor, CharacterActions.characterRemoved(Trogdor.id))
      expect(result).toEqual(stateWithGimli)
    })

    it('does nothing if character does not exist', () => {
      const result = reduceCharacterState(stateWithGimliAndTrogdor, CharacterActions.characterRemoved('any-missing-id'))
      expect(result).toEqual(stateWithGimliAndTrogdor)
    })
  })
})
