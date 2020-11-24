import { WORLD_ID } from '../constants'
import { buildEntity } from '../entity'
import { buildWorldState, WorldStateBuilders } from '../world-state'

import { makeWorld } from './facet'
import { getWorldTime } from './selectors'

const { addEntity, updateEntity } = WorldStateBuilders

const worldEntity = buildEntity({ id: WORLD_ID }, makeWorld())
const otherEntity = buildEntity({ id: 'other-entity' })

const state = buildWorldState(
  addEntity(worldEntity),
  addEntity(otherEntity)
)

describe('world selectors', () => {
  describe('getTime', () => {
    it('is Nothing when there is no World entity', () => {
      const stateWithoutWorld = buildWorldState(
        addEntity(otherEntity)
      )

      expect(getWorldTime(stateWithoutWorld).isNothing()).toBe(true)
    })

    it('is Just the default world time when there is a World entity', () => {
      const result = getWorldTime(state)
      expect(result.isSome()).toBe(true)
      expect(result.just()).toBe(0)
    })

    it('is Just the correct world time when the time is not default', () => {
      const input = updateEntity(
        WORLD_ID,
        (world) => ({ ...world, time: 123 })
      )(state)

      const result = getWorldTime(input)
      expect(result.isSome()).toBe(true)
      expect(result.just()).toBe(123)
    })
  })
})
