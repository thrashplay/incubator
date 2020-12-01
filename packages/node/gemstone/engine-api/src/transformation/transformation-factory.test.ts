import { WorldState } from '../world'

import { createTransformationFactory } from './transformation-factory'

describe('createTransformationFactory (, result of)', () => {
  const factory = createTransformationFactory()

  describe('without parameter', () => {
    it('sets type on returned TransformationDescriptor to first argument', () => {
      const result = factory('expected-type')
      expect(result.type).toEqual('expected-type')
    })

    it('sets parameter to undefined', () => {
      const result = factory('expected-type')
      expect(result.parameter).toBeUndefined()
    })
  })

  describe('with parameter', () => {
    it('sets type on returned TransformationDescriptor to first argument', () => {
      const result = factory('expected-type', 'expected-argument')
      expect(result.type).toEqual('expected-type')
    })

    it('sets parameter to second argument', () => {
      const result = factory('expected-type', 'expected-argument')
      expect(result.parameter).toEqual('expected-argument')
    })
  })

  describe('typed transformations', () => {
    const transformations = {
      noArg: (world: WorldState) => world,
      stringArg: (world: WorldState, arg: string) => ({ ...world, name: arg }),
      complexArg: (world: WorldState, _: { complex: boolean; name: string }) => world,
    }

    const typedFactory = createTransformationFactory<typeof transformations>()

    it('creates no-arg transformation descriptor', () => {
      const result = typedFactory('noArg')
      expect(result.type).toBe('noArg')

      // compile errors
      // expect(result.parameter).toBeUndefined()
      // typedFactory('noArg', 'anything')
    })

    it('creates single arg transformation descriptor', () => {
      const result = typedFactory('stringArg', 'anything')
      expect(result.type).toBe('stringArg')
      expect(result.parameter).toBe('anything')

      // compile errors
      // const result = typedFactory('stringArg')
      // const result = typedFactory('stringArg', 5)
      // typedFactory('noArg', 'anything')
    })

    it('creates complex arg transformation descriptor', () => {
      const result = typedFactory('complexArg', { complex: true, name: 'anything' })
      expect(result.type).toBe('complexArg')
      expect(result.parameter).toEqual({ complex: true, name: 'anything' })
    })
  })
})
