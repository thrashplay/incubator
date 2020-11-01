/* eslint-disable jest/no-commented-out-tests */
import { last, size, take } from 'lodash/fp'

import { CommonEvents } from '../common'

import { ActionFixtures, SceneStateFixtures } from './__fixtures__'
import { SceneEvents } from './events'
import { EMPTY_FRAME, Frame, FrameEvent, FrameEvents, frameReducer } from './frame'
import { reduceSceneState } from './reducer'
import { SceneState } from './state'

const { Default, FiveIdleFrames, IdleBeforeTypicalActions, SingleTypicalFrame } = SceneStateFixtures
const { Grumbling, Idle } = ActionFixtures

const tag = (frameNumber: number, tag: string) => ({
  frameNumber,
  tag,
})

describe('reduceSceneState', () => {
  describe('CommonEvents.initialized', () => {
    it('returns default state', () => {
      const result = reduceSceneState('any value' as unknown as SceneState, CommonEvents.initialized())
      expect(result).toStrictEqual(Default)
    })
  })

  describe('SceneEvents.characterAdded', () => {
    it('adds character if not already present', () => {
      const result = reduceSceneState(SingleTypicalFrame, SceneEvents.characterAdded('batman'))
      expect(result.characters).toHaveLength(3)
      expect(result.characters).toContain('batman')
      expect(result.characters).toContain('gimli')
      expect(result.characters).toContain('trogdor')
    })

    it('does NOT add character if already present', () => {
      const result = reduceSceneState(SingleTypicalFrame, SceneEvents.characterAdded('gimli'))
      expect(result.characters).toHaveLength(2)
      expect(result.characters).toContain('gimli')
      expect(result.characters).toContain('trogdor')
    })

    describe('initial actor status', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.characterAdded('batman'))
      const currentFrameStatus = result.frames[1].actors.batman

      it('is created in current frame', () => {
        expect(currentFrameStatus).toBeDefined()
      })

      it('is not created in previous frames', () => {
        expect(result.frames[0].actors.batman).toBeUndefined()
      })

      it('has correct id', () => {
        expect(currentFrameStatus.id).toBe('batman')
      })

      it('is positioned at origin', () => {
        expect(currentFrameStatus.position.x).toBe(0)
        expect(currentFrameStatus.position.y).toBe(0)
      })

      it('has idle action', () => {
        expect(currentFrameStatus.action).toMatchObject({
          type: 'idle',
        })
      })
    })
  })

  describe('SceneEvents.frameAdded', () => {
    it('does nothing if the new frame is undefined', () => {
      const result = reduceSceneState(
        IdleBeforeTypicalActions,
        SceneEvents.frameAdded(undefined as unknown as Frame)
      )

      expect(result.frames).toStrictEqual(IdleBeforeTypicalActions.frames)
    })

    it('appends the new frame to the frame list', () => {
      const newFrame = { ...EMPTY_FRAME, actors: {} }
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.frameAdded(newFrame))
      expect(result.frames).toHaveLength(IdleBeforeTypicalActions.frames.length + 1)
      expect(result.frames).toContain(newFrame)
    })
  })

  describe('SceneEvents.frameCommitted', () => {
    it('adds an empty frame if the frame list is empty', () => {
      const result = reduceSceneState({ ...Default, frames: [] }, SceneEvents.frameCommitted())
      expect(result.frames).toHaveLength(1)
      expect(result.frames).toStrictEqual([EMPTY_FRAME])
    })

    it('clones the last frame, and appends it to the frame list', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.frameCommitted())
      expect(result.frames).toHaveLength(IdleBeforeTypicalActions.frames.length + 1)
      expect(last(result.frames)).toEqual(last(IdleBeforeTypicalActions.frames))
    })

    it('clears the key frame status', () => {
      const stateWithCurrentKeyFrame = reduceSceneState(IdleBeforeTypicalActions, FrameEvents.keyFrameMarked())
      const result = reduceSceneState(stateWithCurrentKeyFrame, SceneEvents.frameCommitted())
      expect(last(result.frames)!.keyFrame).toBe(false)
    })
  })

  describe('SceneEvents.frameTagged', () => {
    it('does nothing if the frame number is negative', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.frameTagged(tag(-1, 'any-tag')))
      expect(result).toBe(IdleBeforeTypicalActions)
    })

    it('does nothing if the frame number is > number of frames', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.frameTagged(tag(2, 'any-tag')))
      expect(result).toBe(IdleBeforeTypicalActions)
    })

    it('tags the selected frame', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.frameTagged(tag(1, 'testTag')))
      expect(result.frameTags.testTag).toBe(1)
    })

    it('overwrites existing tags', () => {
      const input = {
        ...IdleBeforeTypicalActions,
        frameTags: {
          testTag: 0,
        },
      }
      const result = reduceSceneState(input, SceneEvents.frameTagged(tag(1, 'testTag')))
      expect(result.frameTags.testTag).toBe(1)
    })
  })

  describe('SceneEvents.frameTagDeleted', () => {
    it('does nothing if tag does not exist', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.frameTagDeleted('invalid-tag'))
      expect(result).toStrictEqual(IdleBeforeTypicalActions)
    })

    it('clears an existing frame tag', () => {
      const input = {
        ...FiveIdleFrames,
        frameTags: {
          testTag: 2,
        },
      }

      const result = reduceSceneState(input, SceneEvents.frameTagDeleted('testTag'))
      expect(result.frameTags.testTag).toBeUndefined()
    })
  })

  describe('SceneEvents.actionDeclared', () => {
    const result = reduceSceneState(IdleBeforeTypicalActions, FrameEvents.actionDeclared({
      characterId: 'trogdor',
      action: Grumbling,
    }))

    const trogdorInFirstFrame = result.frames[0].actors.trogdor
    const trogdorInCurrentFrame = result.frames[1].actors.trogdor

    it('does nothing if the character is not present', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, FrameEvents.actionDeclared({
        characterId: 'invalid-id',
        action: Grumbling,
      }))

      expect(result).toStrictEqual(IdleBeforeTypicalActions)
    })

    it('sets the character action in the current frame', () => {
      expect(trogdorInCurrentFrame.action).toStrictEqual(Grumbling)
    })

    it('does not change previous frames', () => {
      // default is Burninating from fixture
      expect(trogdorInFirstFrame.action).toStrictEqual(Idle)
    })
  })

  describe('SceneEvents.moved', () => {
    const result = reduceSceneState(IdleBeforeTypicalActions, FrameEvents.moved({
      characterId: 'trogdor',
      position: { x: 47, y: 111 },
    }))

    const trogdorInFirstFrame = result.frames[0].actors.trogdor
    const trogdorInCurrentFrame = result.frames[1].actors.trogdor

    it('does nothing if the character is not present', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, FrameEvents.moved({
        characterId: 'invalid-id',
        position: { x: 47, y: 111 },
      }))

      expect(result).toStrictEqual(IdleBeforeTypicalActions)
    })

    it('sets the character position in the current frame', () => {
      expect(trogdorInCurrentFrame.position.x).toBe(47)
      expect(trogdorInCurrentFrame.position.y).toBe(111)
    })

    it('does not change previous frames', () => {
      // default is 5,5 from fixture
      expect(trogdorInFirstFrame.position.x).toBe(5)
      expect(trogdorInFirstFrame.position.y).toBe(5)
    })
  })

  describe('SceneEvents.sceneStarted', () => {
    it('replaces existing scene with new one', () => {
      const result = reduceSceneState(IdleBeforeTypicalActions, SceneEvents.sceneStarted())
      expect(result).toStrictEqual(Default)
    })
  })

  describe('SceneEvents.truncated', () => {
    it('does nothing if specified frame is negative', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneEvents.truncated(-1))
      expect(result).toEqual(FiveIdleFrames)
    })

    it('does nothing if specified frame is after the last frame', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneEvents.truncated(size(FiveIdleFrames.frames)))
      expect(result).toEqual(FiveIdleFrames)
    })

    it('does nothing if specified frame is the last frame', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneEvents.truncated(size(FiveIdleFrames.frames) - 1))
      expect(result).toEqual(FiveIdleFrames)
    })

    it.each([0, 1, 2, 3, 4])('deletes frames when specified frame is: %p', (frame) => {
      const result = reduceSceneState(FiveIdleFrames, SceneEvents.truncated(frame))
      expect(result.frames).toStrictEqual(take(frame + 1)(FiveIdleFrames.frames))
    })

    it('does not change tagged frames if they still exist', () => {
      const input = {
        ...FiveIdleFrames,
        frameTags: {
          testTag: 3,
        },
      }

      const result = reduceSceneState(input, SceneEvents.truncated(3))
      expect(result.frameTags.testTag).toBe(3)
    })

    it('clears frame tags that pointed to a removed frame', () => {
      const input = {
        ...FiveIdleFrames,
        frameTags: {
          testTag: 3,
        },
      }

      const result = reduceSceneState(input, SceneEvents.truncated(2))
      expect(result.frameTags.testTag).toBeUndefined()
    })
  })

  describe.each<[string, FrameEvent]>([
    ['actor-added', FrameEvents.actorAdded('batman')],
    ['action-declared', FrameEvents.actionDeclared({ characterId: 'gimli', action: { type: 'anything' } })],
    ['actor-moved', FrameEvents.moved({ characterId: 'gimli', position: { x: 0, y: 0 } })],
    ['time-offset-changed', FrameEvents.timeOffsetChanged(125)],
  ])('frame event: %p', (_name, event) => {
    it('is passed to frameReducer', () => {
      const expectedFrame = frameReducer(last(IdleBeforeTypicalActions.frames)!, event)
      const result = reduceSceneState(IdleBeforeTypicalActions, event)
      expect(last(result.frames)).toStrictEqual(expectedFrame)
    })
  })
})
