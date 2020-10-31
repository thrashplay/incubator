/* eslint-disable jest/no-commented-out-tests */
import { last, size, take } from 'lodash/fp'

import { CommonActions } from '../common'

import { IntentionFixtures, SceneStateFixtures } from './__fixtures__'
import { SceneActions } from './actions'
import { EMPTY_FRAME, Frame, FrameAction, FrameActions, frameReducer } from './frame'
import { reduceSceneState } from './reducer'
import { SceneState } from './state'

const { Default, FiveIdleFrames, IdleBeforeTypicalIntentions, SingleTypicalFrame } = SceneStateFixtures
const { Grumbling, Idle } = IntentionFixtures

describe('reduceSceneState', () => {
  describe('CommonActions.initialized', () => {
    it('returns default state', () => {
      const result = reduceSceneState('any value' as unknown as SceneState, CommonActions.initialized())
      expect(result).toStrictEqual(Default)
    })
  })

  describe('SceneActions.characterAdded', () => {
    it('adds character if not already present', () => {
      const result = reduceSceneState(SingleTypicalFrame, SceneActions.characterAdded('batman'))
      expect(result.characters).toHaveLength(3)
      expect(result.characters).toContain('batman')
      expect(result.characters).toContain('gimli')
      expect(result.characters).toContain('trogdor')
    })

    it('does NOT add character if already present', () => {
      const result = reduceSceneState(SingleTypicalFrame, SceneActions.characterAdded('gimli'))
      expect(result.characters).toHaveLength(2)
      expect(result.characters).toContain('gimli')
      expect(result.characters).toContain('trogdor')
    })

    describe('initial actor status', () => {
      const result = reduceSceneState(IdleBeforeTypicalIntentions, SceneActions.characterAdded('batman'))
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

      it('has idle intention', () => {
        expect(currentFrameStatus.intention).toMatchObject({
          type: 'idle',
        })
      })
    })
  })

  describe('SceneActions.frameAdded', () => {
    it('does nothing if the new frame is undefined', () => {
      const result = reduceSceneState(
        IdleBeforeTypicalIntentions,
        SceneActions.frameAdded(undefined as unknown as Frame)
      )

      expect(result.frames).toStrictEqual(IdleBeforeTypicalIntentions.frames)
    })

    it('appends the new frame to the frame list', () => {
      const newFrame = { ...EMPTY_FRAME, actors: {} }
      const result = reduceSceneState(IdleBeforeTypicalIntentions, SceneActions.frameAdded(newFrame))
      expect(result.frames).toHaveLength(IdleBeforeTypicalIntentions.frames.length + 1)
      expect(result.frames).toContain(newFrame)
    })
  })

  describe('SceneActions.frameCommitted', () => {
    it('adds an empty frame if the frame list is empty', () => {
      const result = reduceSceneState({ ...Default, frames: [] }, SceneActions.frameCommitted())
      expect(result.frames).toHaveLength(1)
      expect(result.frames).toStrictEqual([EMPTY_FRAME])
    })

    it('clones the last frame, and appends it to the frame list', () => {
      const result = reduceSceneState(IdleBeforeTypicalIntentions, SceneActions.frameCommitted())
      expect(result.frames).toHaveLength(IdleBeforeTypicalIntentions.frames.length + 1)
      expect(last(result.frames)).toEqual(last(IdleBeforeTypicalIntentions.frames))
    })

    it('clears the key frame status', () => {
      const stateWithCurrentKeyFrame = reduceSceneState(IdleBeforeTypicalIntentions, FrameActions.keyFrameMarked())
      const result = reduceSceneState(stateWithCurrentKeyFrame, SceneActions.frameCommitted())
      expect(last(result.frames)!.keyFrame).toBe(false)
    })
  })

  describe('SceneActions.intentionDeclared', () => {
    const result = reduceSceneState(IdleBeforeTypicalIntentions, FrameActions.intentionDeclared({
      characterId: 'trogdor',
      intention: Grumbling,
    }))

    const trogdorInFirstFrame = result.frames[0].actors.trogdor
    const trogdorInCurrentFrame = result.frames[1].actors.trogdor

    it('does nothing if the character is not present', () => {
      const result = reduceSceneState(IdleBeforeTypicalIntentions, FrameActions.intentionDeclared({
        characterId: 'invalid-id',
        intention: Grumbling,
      }))

      expect(result).toStrictEqual(IdleBeforeTypicalIntentions)
    })

    it('sets the character intention in the current frame', () => {
      expect(trogdorInCurrentFrame.intention).toStrictEqual(Grumbling)
    })

    it('does not change previous frames', () => {
      // default is Burninating from fixture
      expect(trogdorInFirstFrame.intention).toStrictEqual(Idle)
    })
  })

  describe('SceneActions.moved', () => {
    const result = reduceSceneState(IdleBeforeTypicalIntentions, FrameActions.moved({
      characterId: 'trogdor',
      position: { x: 47, y: 111 },
    }))

    const trogdorInFirstFrame = result.frames[0].actors.trogdor
    const trogdorInCurrentFrame = result.frames[1].actors.trogdor

    it('does nothing if the character is not present', () => {
      const result = reduceSceneState(IdleBeforeTypicalIntentions, FrameActions.moved({
        characterId: 'invalid-id',
        position: { x: 47, y: 111 },
      }))

      expect(result).toStrictEqual(IdleBeforeTypicalIntentions)
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

  describe('SceneActions.sceneStarted', () => {
    it('replaces existing scene with new one', () => {
      const result = reduceSceneState(IdleBeforeTypicalIntentions, SceneActions.sceneStarted())
      expect(result).toStrictEqual(Default)
    })
  })

  describe('SceneActions.truncated', () => {
    it('does nothing if specified frame is negative', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneActions.truncated(-1))
      expect(result).toStrictEqual(FiveIdleFrames)
    })

    it('does nothing if specified frame is after the last frame', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneActions.truncated(size(FiveIdleFrames.frames)))
      expect(result).toStrictEqual(FiveIdleFrames)
    })

    it('does nothing if specified frame is the last frame', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneActions.truncated(size(FiveIdleFrames.frames) - 1))
      expect(result).toStrictEqual(FiveIdleFrames)
    })

    it.each([0, 1, 2, 3, 4])('deletes frames when specified frame is: %p', (frame) => {
      const result = reduceSceneState(FiveIdleFrames, SceneActions.truncated(frame))
      expect(result.frames).toStrictEqual(take(frame + 1)(FiveIdleFrames.frames))
    })
  })

  describe.each<[string, FrameAction]>([
    ['actor-added', FrameActions.actorAdded('batman')],
    ['intention-declared', FrameActions.intentionDeclared({ characterId: 'gimli', intention: { type: 'anything' } })],
    ['actor-moved', FrameActions.moved({ characterId: 'gimli', position: { x: 0, y: 0 } })],
    ['time-offset-changed', FrameActions.timeOffsetChanged(125)],
  ])('frame action: %p', (_name, action) => {
    it('is passed to frameReducer', () => {
      const expectedFrame = frameReducer(last(IdleBeforeTypicalIntentions.frames)!, action)
      const result = reduceSceneState(IdleBeforeTypicalIntentions, action)
      expect(last(result.frames)).toStrictEqual(expectedFrame)
    })
  })
})
