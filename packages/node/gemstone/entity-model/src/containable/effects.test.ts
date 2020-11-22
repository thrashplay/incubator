import { buildWorldState, WorldStateBuilders } from '@thrashplay/gemstone-engine'

import { buildEntity } from '../entity-builders'

import { Containable } from './containable'
import { Container } from './container'
import { placeInside } from './effects'

const { addEntity } = WorldStateBuilders

const animal = buildEntity({ id: 'animal' })
const hammer = buildEntity({ id: 'hammer' }, Containable.extend)
const smallBag = buildEntity({ id: 'smallBag' }, Container.extend)

/**
 * A game with three entities (animal, hammer and smallBag). None of them contain the other sby default, but the
 * hammer has the Containable facet and the smallBag has the Container facet. The animal has no facets.
 **/
const BASE_STATE = buildWorldState(
  addEntity(hammer),
  addEntity(smallBag)
)

describe('containable effects', () => {
  describe('placeInside', () => {
    describe('invalid item handling', () => {
      it('does not alter state if the item ID does not exist', () => {
        const result = placeInside('invalid-id', smallBag.id)(BASE_STATE)
        expect(result).toBe(BASE_STATE)
      })

      it('does not alter state if the item is not Containable', () => {
        const result = placeInside(animal.id, smallBag.id)(BASE_STATE)
        expect(result).toBe(BASE_STATE)
      })
    })

    describe('invalid container handling', () => {
      it('does not alter state if the container ID does not exist', () => {
        const result = placeInside(hammer.id, 'invalid-id')(BASE_STATE)
        expect(result).toBe(BASE_STATE)
      })

      it('does not alter state if the container is not a Container', () => {
        const result = placeInside(hammer.id, animal.id)(BASE_STATE)
        expect(result).toBe(BASE_STATE)
      })
    })

    describe('valid inputs', () => {
      it('sets the container ID on the item', () => {
        const result = placeInside(hammer.id, smallBag.id)(BASE_STATE)
        expect(result.entities.hammer.containerId).toBe(smallBag.id)
      })

      it('adds the item ID to the container contents', () => {
        const result = placeInside(hammer.id, smallBag.id)(BASE_STATE)

        const contents = result.entities.smallBag.contents
        expect(contents).toHaveLength(1)
        expect(contents).toContain(hammer.id)
      })
    })
  })
})
