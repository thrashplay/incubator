import { forSceneSelector, Scenes } from '../../__fixtures__'

import { getReachableTargets } from './spatial'

const { WithGimliAndTreestumpInMelee } = Scenes

const withMelee = forSceneSelector(WithGimliAndTreestumpInMelee)

describe('scene selectors - spatial', () => {
  describe('getReachableTargets', () => {
    it('does not include self', () => {
      const result = getReachableTargets(withMelee, { characterId: 'gimli' })
      expect(result).not.toContainEqual(expect.objectContaining({
        id: 'gimli',
      }))
    })

    it('does not include out of range targets', () => {
      const result = getReachableTargets(withMelee, { characterId: 'gimli' })
      expect(result).not.toContainEqual(expect.objectContaining({
        id: 'trogdor',
      }))
    })

    it('includes correct results', () => {
      const result = getReachableTargets(withMelee, { characterId: 'gimli' })
      expect(result).toHaveLength(1)
      expect(result).toContainEqual(expect.objectContaining({
        id: 'treestump',
      }))
    })
  })
})
