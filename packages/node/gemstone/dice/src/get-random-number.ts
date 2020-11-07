/**
 * Function that returns a random number between the first and second arguments (inclusive),
 * or between 1 the number given if only a single argument was provided.
 */
export type GetRandomNumberFunction = (singleValueOrMin: number, max?: number) => number

/**
 * Creates a GetRandomNumberFunction that uses the specified randomizationFunction as the
 * source of randomness. This function must return a random number in the range 0 to less
 * than 1 (inclusive of 0, but not 1).
 *
 * TODO: There is currently no useful way to leverage this with the Dice API
 */
export const createGetRandomNumber = (
  randomizationFunction: () => number
): GetRandomNumberFunction => (singleValueOrMin: number, max?: number) => {
  return max === undefined
    ? Math.floor(randomizationFunction() * (singleValueOrMin - 1 + 1)) + 1
    : Math.floor(randomizationFunction() * (max - singleValueOrMin + 1)) + singleValueOrMin
}

/** The default GetRandomNumberFunction, which uses Math.random as its source of randomness */
export const getRandomNumber = createGetRandomNumber(Math.random)
