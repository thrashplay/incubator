import { keys } from 'lodash/fp'

import { Actions, Frames } from '../../__fixtures__'

import { FrameEvents } from './events'
import { frameReducer } from './frame-reducer'

const { Grumbling } = Actions
const { Empty, TypicalActions } = Frames

describe('frameReducer', () => {
  describe('FrameEvents.characterAdded', () => {
    it('adds actor if not already present', () => {
      const result = frameReducer(Empty, FrameEvents.actorAdded('gimli'))

      const ids = keys(result.actors)
      expect(ids).toHaveLength(1)
      expect(ids).toContain('gimli')
    })

    it('does NOT add actor if already present', () => {
      const result = frameReducer(TypicalActions, FrameEvents.actorAdded('gimli'))

      const ids = keys(result.actors)
      expect(ids).toHaveLength(3)
      expect(ids).toContain('gimli')
      expect(ids).toContain('treestump')
      expect(ids).toContain('trogdor')
    })

    it.todo('does NOT add actor if character ID is invalid')

    describe('initial actor status', () => {
      const result = frameReducer(Empty, FrameEvents.actorAdded('gimli'))
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

      it('has idle action', () => {
        expect(status.action).toMatchObject({
          type: 'idle',
        })
      })
    })
  })

  describe('FrameEvents.actionDeclared', () => {
    it('does nothing if the character is not present', () => {
      const result = frameReducer(TypicalActions, FrameEvents.actionDeclared({
        characterId: 'invalid-id',
        action: Grumbling,
      }))

      expect(result).toStrictEqual(TypicalActions)
    })

    it('sets the character action', () => {
      const result = frameReducer(TypicalActions, FrameEvents.actionDeclared({
        characterId: 'trogdor',
        action: Grumbling,
      }))

      const status = result.actors.trogdor
      expect(status.action).toStrictEqual(Grumbling)
    })
  })

  describe('FrameEvents.keyFrameMarked', () => {
    it('sets the key frame flag', () => {
      const result = frameReducer(TypicalActions, FrameEvents.keyFrameMarked())
      expect(result.keyFrame).toBe(true)
    })
  })

  describe('FrameEvents.moved', () => {
    it.each<[string, any]>([
      ['undefined', undefined],
      ['x is undefined', { x: undefined, y: 10 }],
      ['x is NaN', { x: NaN, y: 10 }],
      ['x is Infinity', { x: Infinity, y: 10 }],
      ['x is -Infinity', { x: -Infinity, y: 10 }],
      ['y is undefined', { x: 10, y: undefined }],
      ['y is NaN', { x: 10, y: NaN }],
      ['y is Infinity', { x: 10, y: Infinity }],
      ['y is -Infinity', { x: 10, y: -Infinity }],
    ])('does nothing if coordinates are invalid: %p', (_name, badPosition) => {
      expect(frameReducer(TypicalActions, FrameEvents.moved({
        characterId: 'trogdor',
        position: badPosition as any,
      }))).toBe(TypicalActions)
    })

    it('does nothing if the character is not present', () => {
      const result = frameReducer(TypicalActions, FrameEvents.moved({
        characterId: 'invalid-id',
        position: { x: 47, y: 111 },
      }))

      expect(result).toStrictEqual(TypicalActions)
    })

    it('sets the character position', () => {
      const result = frameReducer(TypicalActions, FrameEvents.moved({
        characterId: 'trogdor',
        position: { x: 47, y: 111 },
      }))

      const status = result.actors.trogdor

      expect(status.position.x).toBe(47)
      expect(status.position.y).toBe(111)
    })
  })

  describe('FrameEvents.movementModeChanged', () => {
    it('does nothing if the character is not present', () => {
      const result = frameReducer(TypicalActions, FrameEvents.movementModeChanged({
        characterId: 'invalid-id',
        mode: 'run',
      }))

      expect(result).toStrictEqual(TypicalActions)
    })

    it('sets the character movement mode', () => {
      const result = frameReducer(TypicalActions, FrameEvents.movementModeChanged({
        characterId: 'trogdor',
        mode: 'run',
      }))

      const status = result.actors.trogdor
      expect(status.movementMode).toBe('run')
    })
  })

  describe('FrameEvents.targetChanged', () => {
    it('does nothing if the character is not present', () => {
      const result = frameReducer(TypicalActions, FrameEvents.targetChanged({
        characterId: 'invalid-id',
        targetId: 'gimli',
      }))

      expect(result).toStrictEqual(TypicalActions)
    })

    it('does nothing if the target is not present', () => {
      const result = frameReducer(TypicalActions, FrameEvents.targetChanged({
        characterId: 'gimli',
        targetId: 'invalid-id',
      }))

      expect(result).toStrictEqual(TypicalActions)
    })

    it('sets the character target', () => {
      const result = frameReducer(TypicalActions, FrameEvents.targetChanged({
        characterId: 'trogdor',
        targetId: 'gimli',
      }))

      const status = result.actors.trogdor
      expect(status.target).toBe('gimli')
    })
  })

  describe('FrameEvents.targetRemoved', () => {
    const inputState = {
      ...TypicalActions,
      actors: {
        ...TypicalActions.actors,
        gimli: {
          ...TypicalActions.actors.gimli,
          target: 'trogdor',
        },
      },
    }

    it('does nothing if the character is not present', () => {
      const result = frameReducer(inputState, FrameEvents.targetRemoved('invalid-id'))
      expect(result).toStrictEqual(inputState)
    })

    it('removes the character target', () => {
      const result = frameReducer(inputState, FrameEvents.targetRemoved('gimli'))
      const status = result.actors.gimli
      expect(status.target).toBeUndefined()
    })
  })

  describe('FrameEvents.timeOffsetChanged', () => {
    it('does nothing if new value is negative', () => {
      const result = frameReducer(TypicalActions, FrameEvents.timeOffsetChanged(-1))
      expect(result).toStrictEqual(TypicalActions)
    })

    it('sets time to new value', () => {
      const result = frameReducer(TypicalActions, FrameEvents.timeOffsetChanged(101))
      expect(result).toStrictEqual({
        ...TypicalActions,
        timeOffset: 101,
      })
    })
  })
})
