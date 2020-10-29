import { keys } from 'lodash/fp'

import { FrameFixtures, IntentionFixtures } from './__fixtures__'
import { SimulationActions } from './actions'
import { frameReducer } from './frame-reducer'

const { Grumbling } = IntentionFixtures
const { Empty, TypicalIntentions } = FrameFixtures

describe('frameReducer', () => {
  describe('SimulationActions.characterAdded', () => {
    it('adds actor if not already present', () => {
      const result = frameReducer(Empty, SimulationActions.characterAdded('gimli'))

      const ids = keys(result.actors)
      expect(ids).toHaveLength(1)
      expect(ids).toContain('gimli')
    })

    it('does NOT add actor if already present', () => {
      const result = frameReducer(TypicalIntentions, SimulationActions.characterAdded('gimli'))

      const ids = keys(result.actors)
      expect(ids).toHaveLength(2)
      expect(ids).toContain('gimli')
      expect(ids).toContain('trogdor')
    })

    it.todo('does NOT add actor if character ID is invalid')

    describe('initial actor status', () => {
      const result = frameReducer(Empty, SimulationActions.characterAdded('gimli'))
      const status = result.actors.gimli

      it('is created in current frame', () => {
        expect(status).toBeDefined()
      })

      it('has correct id', () => {
        expect(status.id).toBe('gimli')
      })

      it('is positioned at origin', () => {
        expect(status.position.x).toBe(0)
        expect(status.position.y).toBe(0)
      })

      it('has idle intention', () => {
        expect(status.intention).toMatchObject({
          type: 'idle',
        })
      })
    })
  })

  describe('SimulationActions.intentionDeclared', () => {
    it('does nothing if the character is not present', () => {
      const result = frameReducer(TypicalIntentions, SimulationActions.intentionDeclared({
        characterId: 'invalid-id',
        intention: Grumbling,
      }))

      expect(result).toStrictEqual(TypicalIntentions)
    })

    it('sets the character intention', () => {
      const result = frameReducer(TypicalIntentions, SimulationActions.intentionDeclared({
        characterId: 'trogdor',
        intention: Grumbling,
      }))

      const status = result.actors.trogdor
      expect(status.intention).toStrictEqual(Grumbling)
    })
  })

  describe('SimulationActions.moved', () => {
    it('does nothing if the character is not present', () => {
      const result = frameReducer(TypicalIntentions, SimulationActions.moved({
        characterId: 'invalid-id',
        position: { x: 47, y: 111 },
      }))

      expect(result).toStrictEqual(TypicalIntentions)
    })

    it('sets the character position', () => {
      const result = frameReducer(TypicalIntentions, SimulationActions.moved({
        characterId: 'trogdor',
        position: { x: 47, y: 111 },
      }))

      const status = result.actors.trogdor

      expect(status.position.x).toBe(47)
      expect(status.position.y).toBe(111)
    })
  })
})
