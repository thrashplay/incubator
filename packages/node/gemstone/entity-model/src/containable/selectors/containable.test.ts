import { buildEntity, buildWorldState, WorldStateBuilders } from '@thrashplay/gemstone-engine'

import { EntityBuilders } from '../../entity-builders'
import { Containable } from '../containable'
import { Container } from '../container'

import { getContainer, isContainableId } from './containable'

const { setContainerId } = EntityBuilders
const { addEntity, updateEntity } = WorldStateBuilders

const smallBag = buildEntity({ id: 'smallBag' }, Container.extend)
const hammer = buildEntity({ id: 'hammer' }, Containable.extend)

/**
 * A game with two entities (hammer and smallBag). Neither of them contain the other by default, but the
 * hammer has the Containable facet and the smallBag has the Container facet.
 **/
const BASE_STATE = buildWorldState(
  addEntity(hammer),
  addEntity(smallBag)
)

describe('containable tests', () => {
  describe('getContainer', () => {
    it('returns nothing, if no container ID', () => {
      const result = getContainer(BASE_STATE)(hammer.id)
      expect(result.isSome()).toBe(false)
    })

    it('returns nothing, if container does not exist', () => {
      const input = updateEntity(hammer.id, setContainerId('invalid-id'))(BASE_STATE)
      const result = getContainer(input)(hammer.id)
      expect(result.isSome()).toBe(false)
    })

    it('returns container, if one exists', () => {
      const input = updateEntity(hammer.id, setContainerId(smallBag.id))(BASE_STATE)
      const result = getContainer(input)(hammer.id)
      expect(result.orUndefined()).toBe(smallBag)
    })
  })

  describe('isContainableId', () => {
    it('returns false if the entity does not exist', () => {
      const result = isContainableId(BASE_STATE)('invalid-id')
      expect(result).toBe(false)
    })

    it('returns false if the entity does NOT have the Containable facet', () => {
      const result = isContainableId(BASE_STATE)(smallBag.id)
      expect(result).toBe(false)
    })

    it('returns true if the entity DOES have the Containable facet', () => {
      const result = isContainableId(BASE_STATE)(hammer.id)
      expect(result).toBe(true)
    })
  })
})
