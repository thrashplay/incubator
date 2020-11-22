import { buildWorldState, WorldStateBuilders } from '@thrashplay/gemstone-engine'

import { buildEntity } from '../../entity-builders'
import { Containable } from '../containable'
import { Container } from '../container'
import { addToContents } from '../mutators'

import { getContentIds, getContents, isContainerId } from './container'

const { addEntity, updateEntity } = WorldStateBuilders

const hammer = buildEntity({ id: 'hammer' }, Containable.extend)
const nail = buildEntity({ id: 'nail' }, Containable.extend)
const smallBag = buildEntity({ id: 'smallBag' }, Container.extend)

/**
 * A game with three entities (hammer, nail, and smallBag). None of them contain the others by default, but the
 * hammer and nail have the Containable facet and the smallBag has the Container facet.
 **/
const BASE_STATE = buildWorldState(
  addEntity(hammer),
  addEntity(nail),
  addEntity(smallBag)
)

describe('container tests', () => {
  describe('isContainer', () => {
    it('returns false if the entity does not exist', () => {
      const result = isContainerId(BASE_STATE)('invalid-id')
      expect(result).toBe(false)
    })

    it('returns false if the entity does NOT have the Container facet', () => {
      const result = isContainerId(BASE_STATE)(hammer.id)
      expect(result).toBe(false)
    })

    it('returns true if the entity DOES have the Container facet', () => {
      const result = isContainerId(BASE_STATE)(smallBag.id)
      expect(result).toBe(true)
    })
  })

  describe('getContentIds', () => {
    it('returns nothing if the entity does not exist', () => {
      const result = getContentIds(BASE_STATE)('invalid-id')
      expect(result.isSome()).toBe(false)
    })

    it('returns nothing if the entity is not a container', () => {
      const result = getContentIds(BASE_STATE)(hammer.id)
      expect(result.isSome()).toBe(false)
    })

    it('returns the ids of contained entities', () => {
      const input = updateEntity(
        smallBag.id,
        addToContents(hammer.id),
        addToContents(nail.id)
      )(BASE_STATE)

      const result = getContentIds(input)(smallBag.id)
      expect(result.isSome()).toBe(true)

      const ids = result.orUndefined()
      expect(ids).toHaveLength(2)
      expect(ids).toContain(hammer.id)
      expect(ids).toContain(nail.id)
    })
  })

  describe('getContents', () => {
    it('returns nothing if the entity does not exist', () => {
      const result = getContents(BASE_STATE)('invalid-id')
      expect(result.isSome()).toBe(false)
    })

    it('returns nothing if the entity is not a container', () => {
      const result = getContents(BASE_STATE)(hammer.id)
      expect(result.isSome()).toBe(false)
    })

    it('returns the contained entities', () => {
      const input = updateEntity(
        smallBag.id,
        addToContents(hammer.id),
        addToContents(nail.id)
      )(BASE_STATE)

      const result = getContents(input)(smallBag.id)
      expect(result.isSome()).toBe(true)

      const contents = result.orUndefined()
      expect(contents).toHaveLength(2)
      expect(contents).toContain(hammer)
      expect(contents).toContain(nail)
    })

    it('filters out contents with invalid IDs', () => {
      const input = updateEntity(
        smallBag.id,
        addToContents(hammer.id),
        addToContents('invalid-id'),
        addToContents(nail.id)
      )(BASE_STATE)

      const result = getContents(input)(smallBag.id)
      expect(result.isSome()).toBe(true)

      const contents = result.orUndefined()
      expect(contents).toHaveLength(2)
      expect(contents).toContain(hammer)
      expect(contents).toContain(nail)
    })
  })
})
