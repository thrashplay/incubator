import { keys } from 'lodash/fp'

import { toDictionary } from './to-dictionary'

const john = {
  id: 123,
  name: 'John Doe',
}

const marsha = {
  id: 'marshaId',
  name: 'Marsha Doe',
}

describe('toDictionary', () => {
  it('result has correct keys', () => {
    const result = toDictionary('id')([john, marsha])
    const resultKeys = keys(result)
    expect(resultKeys).toHaveLength(2)
    expect(resultKeys).toContain('123')
    expect(resultKeys).toContain('marshaId')
  })

  it('result has correct values', () => {
    const result = toDictionary('id')([john, marsha])
    expect(result['123']).toEqual(john)
    expect(result.marshaId).toEqual(marsha)
  })
})
