
import {
  createStateWithDependencies,
  FrameFixtures,
  SceneStateFixtures,
} from '../__fixtures__'
import { Frame } from '../frame'
import { SceneState, SceneStateContainer } from '../state'

import {
  getCurrentFrame,
  getCurrentFrameNumber,
} from '.'

const { AllIdle, Empty, TypicalIntentions } = FrameFixtures
const { Default, FiveIdleFrames, IdleBeforeTypicalIntentions, SingleTypicalFrame, SingleIdleFrame } = SceneStateFixtures

// this is an impossible state, but can be used to test what happens if 'frames' is somehow empty
const emptyState: SceneStateContainer = createStateWithDependencies({
  characters: [],
  currentFrame: 0,
  frames: [],
})

const invalidState = { } as unknown as SceneStateContainer

describe('scene selectors - frames', () => {
  describe('getCurrentFrameNumber', () => {
    it('returns zero if scene state is missing', () => {
      const result = getCurrentFrameNumber(invalidState)
      expect(result).toBe(0)
    })

    it.each<[string, SceneState, number]>([
      ['Default', Default, 0],
      ['SingleTypicalFrame', SingleTypicalFrame, 0],
      ['IdleBeforeTypicalIntentions', IdleBeforeTypicalIntentions, 1],
    ])('returns current frame index: %p', (_name, state, expectedResult) => {
      const result = getCurrentFrameNumber(createStateWithDependencies(state))
      expect(result).toBe(expectedResult)
    })

    it('returns current frame index when last frame is not the current frame', () => {
      const state = {
        ...FiveIdleFrames,
        currentFrame: 2,
      }

      const result = getCurrentFrameNumber(createStateWithDependencies(state))
      expect(result).toBe(2)
    })
  })

  describe('getCurrentFrame', () => {
    it('returns empty frame if scene state is missing', () => {
      const result = getCurrentFrame(invalidState)
      expect(result).toStrictEqual(Empty)
    })

    it('returns empty frame if scene state has no frames', () => {
      const result = getCurrentFrame(emptyState)
      expect(result).toStrictEqual(Empty)
    })

    it('returns empty frame if currentFrame > last frame', () => {
      const state = createStateWithDependencies({ ...FiveIdleFrames, currentFrame: 10 })
      const result = getCurrentFrame(state)
      expect(result).toStrictEqual(Empty)
    })

    it.each<[string, SceneState, Frame]>([
      ['SingleIdleFrame', SingleIdleFrame, AllIdle],
      ['IdleBeforeTypicalIntentions', IdleBeforeTypicalIntentions, TypicalIntentions],
    ])('returns correct frame for: %p', (_fixture, state, expectedFrame) => {
      const result = getCurrentFrame(createStateWithDependencies(state))
      expect(result).toStrictEqual(expectedFrame)
    })

    it('returns correct frame if current frame is not last frame', () => {
      const state = createStateWithDependencies({ ...IdleBeforeTypicalIntentions, currentFrame: 0 })
      const result = getCurrentFrame(state)
      expect(result).toStrictEqual(AllIdle)
    })
  })
})
