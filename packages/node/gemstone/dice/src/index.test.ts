import { getRandomNumber } from './get-random-number'

describe('a', () => {
  it('a', () => {
    for (let a = 1; a < 1000; a++) {
      console.log(getRandomNumber(1, 20))
    }
  })
})
