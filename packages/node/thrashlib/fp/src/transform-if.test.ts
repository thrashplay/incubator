import { stubFalse, stubTrue } from 'lodash/fp'

import { transformIf } from './transform-if'

describe('transformIf', () => {
  const transform = (value: number) => `transformed-${value}`

  it('transforms value, when predicate is true', () => {
    const result = transformIf(stubTrue, transform)(2)
    expect(result).toStrictEqual('transformed-2')
  })

  it('returns unchanged value, when predicate is false', () => {
    const result = transformIf(stubFalse, transform)(2)
    expect(result).toStrictEqual(2)
  })
})
