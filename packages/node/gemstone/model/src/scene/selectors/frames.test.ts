
import {
  createStateWithDependencies,
  FrameFixtures,
  SceneStateFixtures,
} from '../__fixtures__'
import { Frame } from '../frame'
import { EMPTY_SCENE, SceneState, SceneStateContainer } from '../state'

import {
  getCurrentFrame,
  getCurrentFrameNumber,
  getFrameNumber,
  isValidFrameTag,
} from '.'

const { AllIdle, Empty, TypicalActions } = FrameFixtures
const { Default, FiveIdleFrames, IdleBeforeTypicalActions, SingleTypicalFrame, SingleIdleFrame } = SceneStateFixtures

// this is an impossible state, but can be used to test what happens if 'frames' is somehow empty
const emptyState: SceneStateContainer = createStateWithDependencies({
  ...EMPTY_SCENE,
  characters: [],
  frames: [],
})

const invalidState = { } as unknown as SceneStateContainer

const defaultState = createStateWithDependencies(FiveIdleFrames)
const createStateWithTaggedFrame = (tagName: string, frameNumber: number) => ({
  ...defaultState,
  scene: {
    ...defaultState.scene,
    frameTags: {
      [tagName]: frameNumber,
    },
  },
})

describe('scene selectors - frames', () => {
  describe('getCurrentFrameNumber', () => {
    it('returns zero if scene state is missing', () => {
      const result = getCurrentFrameNumber(invalidState)
      expect(result).toBe(0)
    })

    it.each<[string, SceneState, number]>([
      ['Default', Default, 0],
      ['SingleTypicalFrame', SingleTypicalFrame, 0],
      ['IdleBeforeTypicalActions', IdleBeforeTypicalActions, 1],
      ['FiveIdleFrames', FiveIdleFrames, 4],
    ])('returns index of last frame: %p', (_name, state, expectedResult) => {
      const result = getCurrentFrameNumber(createStateWithDependencies(state))
      expect(result).toBe(expectedResult)
    })
  })

  describe('isValidFrameTag', () => {
    const inputState = createStateWithTaggedFrame('testTag', 2)

    it('returns true when tag exists', () => {
      expect(isValidFrameTag(inputState, { frameTag: 'testTag' })).toBe(true)
    })

    it('returns false when tag does not exist', () => {
      expect(isValidFrameTag(inputState, { frameTag: 'invalid-tag' })).toBe(false)
    })

    it('returns true when no tag specified', () => {
      expect(isValidFrameTag(inputState)).toBe(false)
    })
  })

  describe('getFrameNumber', () => {
    const inputState = createStateWithTaggedFrame('testTag', 2)

    it('returns tagged frame if it exists', () => {
      const result = getFrameNumber(inputState, { frameTag: 'testTag' })
      expect(result).toBe(2)
    })

    it('returns current frame fallback if frame tag does not exist and fallback = true', () => {
      const result = getFrameNumber(inputState, { fallback: true, frameTag: 'invalid-tag' })
      expect(result).toBe(4)
    })

    it('returns undefined if frame tag does not exist and fallback = false', () => {
      const result = getFrameNumber(inputState, { fallback: false, frameTag: 'invalid-tag' })
      expect(result).toBeUndefined()
    })

    it('returns currentFrame if no frameTag param', () => {
      const result = getFrameNumber(inputState)
      expect(result).toBe(4)
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

    it.each<[string, SceneState, Frame]>([
      ['SingleIdleFrame', SingleIdleFrame, AllIdle],
      ['IdleBeforeTypicalActions', IdleBeforeTypicalActions, TypicalActions],
    ])('returns correct frame for: %p', (_fixture, state, expectedFrame) => {
      const result = getCurrentFrame(createStateWithDependencies(state))
      expect(result).toStrictEqual(expectedFrame)
    })
  })
})
