import { createBuilder } from './create-builder'

type OneValue = { value: number }

const addToValue = (arg: number) => ({ value }: OneValue): OneValue => ({ value: value + arg })
const multiplyValue = (arg: number) => ({ value }: OneValue): OneValue => ({ value: value * arg })
const builderWithNumericArg = createBuilder((arg: number): OneValue => ({ value: arg }))
const builderWithNoArg = createBuilder((): OneValue => ({ value: 0 }))

describe('createBuilder', () => {
  describe('without required argument', () => {
    it('returns correct product when no builder functions', () => {
      expect(builderWithNoArg()).toEqual({ value: 0 })
    })

    it('returns correct product with builder functions', () => {
      expect(builderWithNoArg(addToValue(5), multiplyValue(10))).toEqual({ value: 50 })
    })

    it('rejects invalid arguments via typings', () => {
      // uncommenting any of the following calls should result in compile errors
      // this test is not automated, but can be used to verify changes to the typings
      // const withUnexpectedArgs = builderWithNoArg(5)
      // const withInvalidFunction = builderWithNoArg(() => 'invalid')

      expect('You are a good person.').toBeTruthy()
    })
  })

  describe('with required argument', () => {
    it('returns correct product when no builder functions', () => {
      expect(builderWithNumericArg(5, addToValue(10))).toEqual({ value: 15 })
    })

    it('returns correct product with builder functions', () => {
      expect(builderWithNumericArg(5, addToValue(5), multiplyValue(10))).toEqual({ value: 100 })
    })

    it('rejects invalid arguments via typings', () => {
      // uncommenting any of the following calls should result in compile errors
      // this test is not automated, but can be used to verify changes to the typings
      // const withoutArgs = builderWithNumericArg()
      // const withInvalidArg = builderWithNumericArg('invalid')
      // const withTwoArgs = builderWithNumericArg(5, 5)
      // const withFunctionsOnly = builderWithNumericArg(addToValue(10))
      // const withArgAndInvalidFunction = builderWithNumericArg(5, () => 'invalid')

      expect('You are a good person.').toBeTruthy()
    })
  })
})
