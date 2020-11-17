import { buildEntity } from '../entity-builders'

import { moveTo } from './effects'
import { extend } from './positionable'

const entity = buildEntity({ id: 'test-id' })
const ARBITRARY_POSITION = { x: 12, y: 1440 }

describe('positionable effects', () => {
  describe('moveTo', () => {
    it('does nothing if the entity has no position', () => {
      const result = moveTo(ARBITRARY_POSITION)(entity)
      expect(result.position).toBeUndefined()
    })

    it('moves the entity if it has a position', () => {
      const positionable = extend(entity)
      const result = moveTo(ARBITRARY_POSITION)(positionable)
      expect(result.position).toBe(ARBITRARY_POSITION)
    })
  })
})
