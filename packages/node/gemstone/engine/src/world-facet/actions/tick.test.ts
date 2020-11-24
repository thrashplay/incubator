import { getType } from 'typesafe-actions'

import { buildWorldState, WORLD_ID } from '../../world-state'
import { WorldTransformations } from '../transformations/creators'

import { WORLD_TICK_ACTION } from './creators'
import { tickHandler } from './tick'

const TICK_ACTION = WORLD_TICK_ACTION

describe('tick action handler', () => {
  describe('supports', () => {
    it('returns true for "tick" actions', () => {
      expect(tickHandler.supports(TICK_ACTION)).toBe(true)
    })

    it('returns false for other actions', () => {
      expect(tickHandler.supports({
        source: WORLD_ID,
        target: WORLD_ID,
        type: 'anything-except-tick',
      })).toBe(false)
    })
  })

  describe('handle', () => {
    it('returns no reactions', () => {
      const result = tickHandler.handle(TICK_ACTION, buildWorldState())
      expect(result.reactions).toHaveLength(0)
    })

    it('returns a single transformation', () => {
      const result = tickHandler.handle(TICK_ACTION, buildWorldState())
      expect(result.transformations).toHaveLength(1)
    })

    it('returns transformation with correct type', () => {
      const result = tickHandler.handle(TICK_ACTION, buildWorldState())
      const transformation = result.transformations[0]
      expect(transformation.type).toBe(getType(WorldTransformations.advanceTime))
    })

    it.todo('returns transformation with correct target')

    it('returns transformation with correct parameter', () => {
      const result = tickHandler.handle(TICK_ACTION, buildWorldState())
      const transformation = result.transformations[0]
      expect(transformation.parameter).toBe(1)
    })
  })
})
