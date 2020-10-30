import { size, take } from 'lodash/fp'

import { CommonActions } from '../common'

import { IntentionFixtures, SceneStateFixtures } from './__fixtures__'
import { SceneActions } from './actions'
import { EMPTY_FRAME, FrameActions } from './frame'
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

  describe('SceneActions.currentFrameChanged', () => {
    it('does nothing if the new value is negative', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneActions.currentFrameChanged(-1))
      expect(result.currentFrame).toBe(FiveIdleFrames.currentFrame)
    })

    it('does nothing if the new value is greater than the hightest frame index', () => {
      const result = reduceSceneState(FiveIdleFrames, SceneActions.currentFrameChanged(5))
      expect(result.currentFrame).toBe(FiveIdleFrames.currentFrame)
    })

    it.each([0, 1, 2, 3, 4])('correct sets new value: %d', (frame) => {
      const result = reduceSceneState(FiveIdleFrames, SceneActions.currentFrameChanged(frame))
      expect(result.currentFrame).toBe(frame)
    })
  })

  describe('SceneActions.frameAdded', () => {
    it('appends the new frame to the frame list', () => {
      const newFrame = { ...EMPTY_FRAME, actors: {} }
      const result = reduceSceneState(IdleBeforeTypicalIntentions, SceneActions.frameAdded(newFrame))
      expect(result.frames).toHaveLength(IdleBeforeTypicalIntentions.frames.length + 1)
      expect(result.frames).toContain(newFrame)
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
    const sceneWithCurrentFrame = (currentFrame: number) => ({
      ...FiveIdleFrames,
      currentFrame,
    })

    it('does nothing if current frame is the last frame', () => {
      const result = reduceSceneState(sceneWithCurrentFrame(size(FiveIdleFrames.frames) - 1), SceneActions.truncated())
      expect(result).toStrictEqual(FiveIdleFrames)
    })

    it.each([0, 1, 2, 3, 4])('deletes frames when current frame is: %p', (currentFrame) => {
      const result = reduceSceneState(sceneWithCurrentFrame(currentFrame), SceneActions.truncated())
      expect(result.frames).toStrictEqual(take(currentFrame + 1)(FiveIdleFrames.frames))
    })
  })
})
