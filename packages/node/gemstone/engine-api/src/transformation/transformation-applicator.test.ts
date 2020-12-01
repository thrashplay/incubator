import { Either } from 'monet'

import { buildWorldState, WorldState } from '../world'

import { createTransformationApplicator } from './transformation-applicator'
import { TransformationError } from './types'

const mockTransformThatPutsBirdOnIt = jest.fn((world: WorldState) => ({
  ...world,
  aBirdIsOnIt: true,
}))

const mockTransformThatPutsPoxOnBothTheirHouses = jest.fn((world: WorldState, arg: number) =>
  Either.Right<TransformationError, any>({
    ...world,
    numberOfPoxes: arg,
  }))

const transformations = {
  putBirdOnIt: mockTransformThatPutsBirdOnIt,
  wrappingTest: mockTransformThatPutsPoxOnBothTheirHouses,
}

describe('createTransformationFactory (, result of)', () => {
  const world = buildWorldState()
  const applicator = createTransformationApplicator(transformations)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns an error if the transformation is unknown', () => {
    const emptyApplicator =
      createTransformationApplicator({}) as (...args: any) => Either<TransformationError, WorldState>
    const result = emptyApplicator({ type: 'anything' })
    expect(result.isLeft()).toBe(true)
  })

  describe('when transformation returns a new WorldState', () => {
    it('passes correct arguments to transformation function', () => {
      applicator({ type: 'putBirdOnIt' }, world)
      expect(mockTransformThatPutsBirdOnIt).toHaveBeenCalledTimes(1)
      expect(mockTransformThatPutsBirdOnIt.mock.calls[0][0]).toEqual(world)
    })

    it('returns correctly modified world state', () => {
      const result = applicator({ type: 'putBirdOnIt' }, world)
      expect(result.isRight()).toBe(true)
      expect(result.right()).toEqual({
        ...world,
        aBirdIsOnIt: true,
      })
    })
  })

  describe('when transformation returns an Either', () => {
    it('passes correct arguments to transformation function', () => {
      applicator({ type: 'wrappingTest', parameter: 2 }, world)
      expect(mockTransformThatPutsPoxOnBothTheirHouses).toHaveBeenCalledTimes(1)
      expect(mockTransformThatPutsPoxOnBothTheirHouses.mock.calls[0][0]).toEqual(world)
      expect(mockTransformThatPutsPoxOnBothTheirHouses.mock.calls[0][1]).toEqual(2)
    })

    it('returns correctly modified world state', () => {
      const result = applicator({ type: 'wrappingTest', parameter: 2 }, world)
      expect(result.isRight()).toBe(true)
      expect(result.right()).toEqual({
        ...world,
        numberOfPoxes: 2,
      })
    })
  })
})
