import { isArray } from 'lodash/fp'
import { getType } from 'typesafe-actions'

import { WORLD_ID } from './../constants'
import { Transformation } from './../transformation'
import { buildWorldState } from './../world-state'
import { tickHandler, WORLD_TICK_ACTION } from './actions'
import { WorldTransformations } from './transformations'

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
      const result = tickHandler.handle(TICK_ACTION, buildWorldState()).right()
      expect(result.reactions).toBeUndefined()
    })

    it('returns a single transformation', () => {
      const result = tickHandler.handle(TICK_ACTION, buildWorldState()).right()
      expect(result.transformations).toBeDefined()
      expect(isArray(result.transformations)).toBe(false)
    })

    it('returns transformation with correct type', () => {
      const result = tickHandler.handle(TICK_ACTION, buildWorldState()).right()
      const transformation = result.transformations as unknown as Transformation<string, any>
      expect(transformation.type).toBe(getType(WorldTransformations.advanceTime))
    })

    it.todo('returns transformation with correct target')

    it('returns transformation with correct parameter', () => {
      const result = tickHandler.handle(TICK_ACTION, buildWorldState()).right()
      const transformation = result.transformations as unknown as Transformation<string, any>
      expect(transformation.parameter).toBe(1)
    })
  })
})
