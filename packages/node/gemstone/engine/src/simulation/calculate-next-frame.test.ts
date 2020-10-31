import { mocked } from 'ts-jest/utils'

import { SceneActions } from '@thrashplay/gemstone-model'

import { createStateWithDependencies, FrameFixtures, SceneStateFixtures } from './__fixtures__'
import { calculateNextFrame } from './calculate-next-frame'
import { getNextFrame } from './get-next-frame'

jest.mock('./get-next-frame')
const mockGetNextFrame = mocked(getNextFrame)

const { AllIdle, TypicalIntentions } = FrameFixtures
const { SingleIdleFrame } = SceneStateFixtures

const INITIAL_FRAME = AllIdle
const NEXT_FRAME = TypicalIntentions

const initialFrameState = createStateWithDependencies({
  ...SingleIdleFrame,
})

describe('calculate-next-frame', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetNextFrame.mockReturnValue(NEXT_FRAME)
  })

  it('passes correct initial frame to simulation', () => {
    calculateNextFrame()(initialFrameState)
    expect(mockGetNextFrame).toHaveBeenCalledTimes(1)
    expect(mockGetNextFrame).toHaveBeenCalledWith(initialFrameState)
  })

  it('returns correct result', () => {
    const result = calculateNextFrame()(initialFrameState)
    expect(result).toEqual(SceneActions.frameAdded(NEXT_FRAME))
  })
})
