import { buildEntity, getEntity } from '../entity'
import { applyTransformation } from '../transformation'

import { WORLD_ID } from './../constants'
import { buildWorldState, WorldStateBuilders } from './../world-state'
import { makeWorld } from './facet'
import { WorldTransformations } from './transformations'

const { addEntity } = WorldStateBuilders

const worldEntity = buildEntity({ id: WORLD_ID }, makeWorld())
const otherEntity = buildEntity({ id: 'old-entity' })

const state = buildWorldState(
  addEntity(worldEntity),
  addEntity(otherEntity)
)

describe('spawnEntity transformation', () => {
  it('adds new entity to the world', () => {
    const newEntity = buildEntity({ id: 'new-entity' })
    const transformation = WorldTransformations.spawnEntity(newEntity)

    const newState = applyTransformation(transformation, state)
    const entity = getEntity(newState)('new-entity')
    expect(entity.isSome()).toBe(true)
    expect(entity.some()).toBe(newEntity)
  })

  it('rejects entity if ID already exists', () => {
    const newEntity = buildEntity({ id: 'new-entity' })
    const transformation = WorldTransformations.spawnEntity(newEntity)

    const newState = applyTransformation(transformation, state)
    expect(getEntity(newState)('new-entity')).toBe(newEntity)
  })
})
