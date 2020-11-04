import { identity, stubTrue } from 'lodash/fp'

import { mapIf } from './map-if'

describe('mapIf', () => {
  describe('empty input', () => {
    it('when collection is empty', () => {
      expect(mapIf(stubTrue, identity)([])).toHaveLength(0)
    })

    it('when collection is null', () => {
      expect(mapIf(stubTrue, identity)(null)).toHaveLength(0)
    })

    it('when collection is undefined', () => {
      expect(mapIf(stubTrue, identity)(undefined)).toHaveLength(0)
    })
  })

  it('transforms correct values', () => {
    const predicate = (value: number) => value === 2

    const result = mapIf(predicate, (value: number) => `transformed-${value}`)([1, 2, 3])
    expect(result).toStrictEqual([1, 'transformed-2', 3])
  })
})
