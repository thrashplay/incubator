import { CommonEvents } from '../common'

import { CharacterFixtures, CharacterStateFixtures, stateWithCharacters } from './__fixtures__'
import { CharacterEvents } from './events'
import { reduceCharacterState } from './reducer'
import { Character, CharacterState } from './state'

const { Gimli, Trogdor } = CharacterFixtures
const { Default } = CharacterStateFixtures

const stateWithGimli = stateWithCharacters(Gimli)
const stateWithTrogdor = stateWithCharacters(Trogdor)
const stateWithGimliAndTrogdor = stateWithCharacters(Gimli, Trogdor)

describe('reduceCharacterState', () => {
  describe('CommonEvents.initialized', () => {
    it('returns default state', () => {
      const result = reduceCharacterState('any value' as unknown as CharacterState, CommonEvents.initialized())
      expect(result).toStrictEqual(Default)
    })
  })

  describe('CharacterEvents.characterAdded', () => {
    it('adds character to PCs list', () => {
      const result = reduceCharacterState(stateWithTrogdor, CharacterEvents.characterCreated(Gimli))
      expect(result).toEqual(stateWithGimliAndTrogdor)
    })

    it('overrides existing character, if one', () => {
      const mirrorTrogdor: Character = {
        id: 'trogdor',
        name: 'Trogdor, the Coldinator',
        speed: 120,
      }

      const result = reduceCharacterState(stateWithGimliAndTrogdor, CharacterEvents.characterCreated(mirrorTrogdor))
      expect(result).toEqual(stateWithCharacters(Gimli, mirrorTrogdor))
    })
  })

  describe('CharacterEvents.characterRemoved', () => {
    it('removes character from PCs list', () => {
      const result = reduceCharacterState(stateWithGimliAndTrogdor, CharacterEvents.characterRemoved(Trogdor.id))
      expect(result).toEqual(stateWithGimli)
    })

    it('does nothing if character does not exist', () => {
      const result = reduceCharacterState(stateWithGimliAndTrogdor, CharacterEvents.characterRemoved('any-missing-id'))
      expect(result).toEqual(stateWithGimliAndTrogdor)
    })
  })
})
