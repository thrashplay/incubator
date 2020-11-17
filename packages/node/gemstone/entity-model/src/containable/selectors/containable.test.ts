import { buildEntity, EntityBuilders } from '../../entity-builders'
import { buildEntitiesContainer, EntitySetBuilders } from '../../entity-set-builders'
import { Containable } from '../containable'
import { Container } from '../container'

import { getContainer, isContainable } from './containable'

const { setContainerId } = EntityBuilders
const { addEntity, updateEntity } = EntitySetBuilders

const smallBag = buildEntity({ id: 'smallBag' }, Container.extend)
const hammer = buildEntity({ id: 'hammer' }, Containable.extend)

/**
 * A game with two entities (hammer and smallBag). Neither of them contain the other by default, but the
 * hammer has the Containable facet and the smallBag has the Container facet.
 **/
const BASE_GAME = buildEntitiesContainer(
  addEntity(hammer),
  addEntity(smallBag)
)

describe('containable tests', () => {
  describe('getContainer', () => {
    it('returns nothing, if no container ID', () => {
      const result = getContainer(BASE_GAME)(hammer.id)
      expect(result.exists).toBe(false)
    })

    it('returns nothing, if container does not exist', () => {
      const input = updateEntity(hammer.id, setContainerId('invalid-id'))(BASE_GAME)
      const result = getContainer(input)(hammer.id)
      expect(result.exists).toBe(false)
    })

    it('returns container, if one exists', () => {
      const input = updateEntity(hammer.id, setContainerId(smallBag.id))(BASE_GAME)
      const result = getContainer(input)(hammer.id)
      expect(result.value).toBe(smallBag)
    })
  })

  describe('isContainable', () => {
    it('returns false if the entity does not exist', () => {
      const result = isContainable(BASE_GAME)('invalid-id')
      expect(result).toBe(false)
    })

    it('returns false if the entity does NOT have the Containable facet', () => {
      const result = isContainable(BASE_GAME)(smallBag.id)
      expect(result).toBe(false)
    })

    it('returns true if the entity DOES have the Containable facet', () => {
      const result = isContainable(BASE_GAME)(hammer.id)
      expect(result).toBe(true)
    })
  })
})
