import { Characters, CharacterStates } from '../__fixtures__'
import { CommonEvents } from '../common'

import { addPc, set } from './builders'
import { CharacterEvents } from './events'
import { reduceCharacterState } from './reducer'
import { CharacterState } from './state'

const { Gimli, Trogdor } = Characters
const { Default, WithGimli, WithGimliAndTrogdor, WithTrogdor } = CharacterStates

describe('reduceCharacterState', () => {
  describe('CommonEvents.initialized', () => {
    it('returns default state', () => {
      const result = reduceCharacterState('any value' as unknown as CharacterState, CommonEvents.initialized())
      expect(result).toStrictEqual(Default)
    })
  })

  describe('CharacterEvents.characterAdded', () => {
    it('adds character to PCs list', () => {
      const result = reduceCharacterState(WithTrogdor, CharacterEvents.characterCreated(Gimli))
      expect(result).toEqual(WithGimliAndTrogdor)
    })

    it('overrides existing character, if one', () => {
      const coldTrogdor = set({ name: 'Trogdor, the Coldinator' })(Trogdor)
      const result = reduceCharacterState(WithGimliAndTrogdor, CharacterEvents.characterCreated(coldTrogdor))
      expect(result).toEqual(addPc(coldTrogdor)(WithGimli))
    })
  })

  describe('CharacterEvents.characterRemoved', () => {
    it('removes character from PCs list', () => {
      const result = reduceCharacterState(WithGimliAndTrogdor, CharacterEvents.characterRemoved(Trogdor.id))
      expect(result).toEqual(WithGimli)
    })

    it('does nothing if character does not exist', () => {
      const result = reduceCharacterState(WithGimliAndTrogdor, CharacterEvents.characterRemoved('any-missing-id'))
      expect(result).toEqual(WithGimliAndTrogdor)
    })
  })
})
