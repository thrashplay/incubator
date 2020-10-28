import { forEach, head, tail } from 'lodash/fp'
import { mocked } from 'ts-jest/utils'

import { createStateWithDependencies, SceneStateFixtures } from '../__fixtures__'
import { SceneActions } from '../actions'
import { SceneStateContainer } from '../state'

import { calculateFrames } from './calculate-frames'
import { calculateNextFrame } from './calculate-next-frame'

jest.mock('./calculate-next-frame')
const mockCalculateNextFrame = mocked(calculateNextFrame)

const { FiveIdleFrames, SingleIdleFrame } = SceneStateFixtures

const ANY_VALID_STATE = 'any-valid-state' as unknown as SceneStateContainer
const executeCommandResult = (result: ReturnType<ReturnType<typeof calculateFrames>>) => {
  forEach((command: ReturnType<typeof calculateNextFrame>) => command(ANY_VALID_STATE))(result)
}

const singleFrameState = createStateWithDependencies({
  ...SingleIdleFrame,
})

const fiveIdleFrames = createStateWithDependencies(FiveIdleFrames)

describe('calculateFrames', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCalculateNextFrame.mockReturnValue(() => [])
  })

  it.each([
    [0, 0],
    [5, 0],
    [-5, 10],
    [5, -10],
  ])('does nothing if [startFrame, endFrame] pair is invalid: [%p, %p]', (start: number, end: number) => {
    const result = calculateFrames(end, start)(singleFrameState)
    executeCommandResult(result)
    expect(result.length).toBe(0)
    expect(mockCalculateNextFrame).toHaveBeenCalledTimes(0)
  })

  it.each<[number | undefined, number, number]>([
    [undefined, 4, 0],
    [undefined, 5, 1],
    [undefined, 15, 11],
    [4, 15, 11],
    [10, 15, 11],
  ])('calculates correct number of future frames after existing 5: %p - %p', (
    start: number | undefined,
    end: number,
    expectedNewFrames: number
  ) => {
    const result = calculateFrames(end, start)(fiveIdleFrames)
    executeCommandResult(result)
    expect(result.length).toBe(expectedNewFrames)
    expect(mockCalculateNextFrame).toHaveBeenCalledTimes(expectedNewFrames)
  })

  it.each<[number, number, number]>([
    [0, 4, 4],
    [1, 10, 9],
    [3, 4, 1],
  ])('rewinds and replaces frames if start is in the past: %p - %p', (
    start: number,
    end: number,
    expectedNewFrames: number
  ) => {
    const result = calculateFrames(end, start)(fiveIdleFrames)

    const rewindAction = head(result)
    expect(rewindAction).toEqual(SceneActions.frameReverted(start))

    const newFrameCommands = tail(result)
    expect(newFrameCommands.length).toBe(expectedNewFrames)
    executeCommandResult(newFrameCommands)
    expect(mockCalculateNextFrame).toHaveBeenCalledTimes(expectedNewFrames)
  })
})
