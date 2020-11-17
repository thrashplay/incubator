import { buildEntity } from '../../entity-builders'
import { buildEntitiesContainer, EntitySetBuilders } from '../../entity-set-builders'
import { Containable } from '../containable'
import { Container } from '../container'
import { addToContents } from '../mutators'

import { getContentIds, getContents, isContainer } from './container'

const { addEntity, updateEntity } = EntitySetBuilders

const hammer = buildEntity({ id: 'hammer' }, Containable.extend)
const nail = buildEntity({ id: 'nail' }, Containable.extend)
const smallBag = buildEntity({ id: 'smallBag' }, Container.extend)

/**
 * A game with three entities (hammer, nail, and smallBag). None of them contain the others by default, but the
 * hammer and nail have the Containable facet and the smallBag has the Container facet.
 **/
const BASE_GAME = buildEntitiesContainer(
  addEntity(hammer),
  addEntity(nail),
  addEntity(smallBag)
)

describe('container tests', () => {
  describe('isContainer', () => {
    it('returns false if the entity does not exist', () => {
      const result = isContainer(BASE_GAME)('invalid-id')
      expect(result).toBe(false)
    })

    it('returns false if the entity does NOT have the Container facet', () => {
      const result = isContainer(BASE_GAME)(hammer.id)
      expect(result).toBe(false)
    })

    it('returns true if the entity DOES have the Container facet', () => {
      const result = isContainer(BASE_GAME)(smallBag.id)
      expect(result).toBe(true)
    })
  })

  describe('getContentIds', () => {
    it('returns nothing if the entity does not exist', () => {
      const result = getContentIds(BASE_GAME)('invalid-id')
      expect(result.exists).toBe(false)
    })

    it('returns nothing if the entity is not a container', () => {
      const result = getContentIds(BASE_GAME)(hammer.id)
      expect(result.exists).toBe(false)
    })

    it('returns the ids of contained entities', () => {
      const input = updateEntity(
        smallBag.id,
        addToContents(hammer.id),
        addToContents(nail.id)
      )(BASE_GAME)

      const result = getContentIds(input)(smallBag.id)
      expect(result.exists).toBe(true)

      const ids = result.value
      expect(ids).toHaveLength(2)
      expect(ids).toContain(hammer.id)
      expect(ids).toContain(nail.id)
    })
  })

  describe('getContents', () => {
    it('returns nothing if the entity does not exist', () => {
      const result = getContents(BASE_GAME)('invalid-id')
      expect(result.exists).toBe(false)
    })

    it('returns nothing if the entity is not a container', () => {
      const result = getContents(BASE_GAME)(hammer.id)
      expect(result.exists).toBe(false)
    })

    it('returns the contained entities', () => {
      const input = updateEntity(
        smallBag.id,
        addToContents(hammer.id),
        addToContents(nail.id)
      )(BASE_GAME)

      const result = getContents(input)(smallBag.id)
      expect(result.exists).toBe(true)

      const contents = result.value
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
      )(BASE_GAME)

      const result = getContents(input)(smallBag.id)
      expect(result.exists).toBe(true)

      const contents = result.value
      expect(contents).toHaveLength(2)
      expect(contents).toContain(hammer)
      expect(contents).toContain(nail)
    })
  })
})
