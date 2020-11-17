import { flow } from 'lodash/fp'

import { buildEntity, EntityBuilders } from '../entity-builders'
import { buildEntitiesContainer, EntitySetBuilders } from '../entity-set-builders'

import { getPosition } from './selectors'

const { setPosition, setContainerId } = EntityBuilders
const { addEntity, updateEntity } = EntitySetBuilders

const largeBag = buildEntity({ id: 'largeBag' })
const smallBag = buildEntity({ id: 'smallBag' })
const hammer = buildEntity({ id: 'hammer' })

/**
 * A game with three entities (hammer, smallBag, and largeBag);
 * None of them contain the others or have positions by default.
 **/
const BASE_GAME = buildEntitiesContainer(
  addEntity(hammer),
  addEntity(smallBag),
  addEntity(largeBag)
)

const ARBITRARY_POSITION = { x: 12, y: 144 }
const WRONG_POSITION = { x: 123, y: 456 }

describe('positionable tests', () => {
  describe('getPosition', () => {
    it('returns nothing, if entity does not exist', () => {
      const result = getPosition(BASE_GAME)('non-existent-id')
      expect(result.exists).toBe(false)
    })

    describe('without container', () => {
      it('returns nothing, if entity has no position', () => {
        const result = getPosition(BASE_GAME)(hammer.id)
        expect(result.exists).toBe(false)
      })

      it('returns position, if entity has one', () => {
        const input = updateEntity(hammer.id, setPosition(ARBITRARY_POSITION))(BASE_GAME)
        const result = getPosition(input)(hammer.id)
        expect(result.value).toEqual(ARBITRARY_POSITION)
      })
    })

    describe('with single container', () => {
      // place the hammer inside the small bag
      const game = updateEntity(hammer.id, setContainerId(smallBag.id))(BASE_GAME)

      it('returns nothing, if container ID is invalid', () => {
        const input = updateEntity(hammer.id, setContainerId('invalid-container-id'))(game)
        const result = getPosition(input)(hammer.id)
        expect(result.exists).toBe(false)
      })

      it('returns nothing, if neither container nor entity have a position', () => {
        const result = getPosition(game)(hammer.id)
        expect(result.exists).toBe(false)
      })

      it('returns nothing, if container has no position but entity does', () => {
        const input = updateEntity(hammer.id, setPosition(ARBITRARY_POSITION))(game)
        const result = getPosition(input)(hammer.id)
        expect(result.exists).toBe(false)
      })

      it('returns container position, if entity has none', () => {
        const input = updateEntity(smallBag.id, setPosition(ARBITRARY_POSITION))(game)
        const result = getPosition(input)(hammer.id)
        expect(result.value).toEqual(ARBITRARY_POSITION)
      })

      it('returns container position, even if entity has its own position', () => {
        const input = flow(
          updateEntity(smallBag.id, setPosition(ARBITRARY_POSITION)),
          updateEntity(hammer.id, setPosition(WRONG_POSITION))
        )(game)

        const result = getPosition(input)(hammer.id)
        expect(result.value).toEqual(ARBITRARY_POSITION)
      })
    })

    describe('with nested container', () => {
      // place the hammer inside the small bag, and the small bag inside the large bag
      const game = flow(
        updateEntity(hammer.id, setContainerId(smallBag.id)),
        updateEntity(smallBag.id, setContainerId(largeBag.id))
      )(BASE_GAME)

      it('returns nothing, if container\'s container ID is invalid', () => {
        const input = updateEntity(smallBag.id, setContainerId('invalid-container-id'))(game)
        const result = getPosition(input)(hammer.id)
        expect(result.exists).toBe(false)
      })

      it('returns nothing, if no containers nor entity have a position', () => {
        const result = getPosition(game)(hammer.id)
        expect(result.exists).toBe(false)
      })

      it('returns nothing, if top-level container has no position but entity nested one does', () => {
        const input = updateEntity(smallBag.id, setPosition(ARBITRARY_POSITION))(game)
        const result = getPosition(input)(hammer.id)
        expect(result.exists).toBe(false)
      })

      it('returns top-level container position, if intermediate one has none', () => {
        const input = updateEntity(largeBag.id, setPosition(ARBITRARY_POSITION))(game)
        const result = getPosition(input)(hammer.id)
        expect(result.value).toEqual(ARBITRARY_POSITION)
      })

      it('returns top-level container position, even if intermediate container has its own position', () => {
        const input = flow(
          updateEntity(largeBag.id, setPosition(ARBITRARY_POSITION)),
          updateEntity(smallBag.id, setPosition(WRONG_POSITION)),
          updateEntity(hammer.id, setPosition(WRONG_POSITION))
        )(game)

        const result = getPosition(input)(hammer.id)
        expect(result.value).toEqual(ARBITRARY_POSITION)
      })
    })
  })

  describe('container nesting cycles', () => {
    it.todo('write tests for this')
  })
})
