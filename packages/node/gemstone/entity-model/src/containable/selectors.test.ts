import { buildEntity, EntityBuilders } from '../entity-builders'
import { buildEntitiesContainer, EntitySetBuilders } from '../entity-set-builders'

import { getContainer } from './selectors'

const { setContainerId } = EntityBuilders
const { addEntity, updateEntity } = EntitySetBuilders

const smallBag = buildEntity({ id: 'smallBag' })
const hammer = buildEntity({ id: 'hammer' })

/**
 * A game with two entities (hammer and smallBag). Neither of them contain the other by default.
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
})
