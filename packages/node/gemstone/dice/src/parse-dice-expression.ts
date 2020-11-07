import { parseInt } from 'lodash'
import { flow, isArray, isEmpty, isNumber, isString, negate, reduce, startsWith, stubString } from 'lodash/fp'

import { mapIf, transformIf } from '@thrashplay/fp'

import { DiceExpression, DiceExpressionPart } from './dice-expression'

// RegEx for a complete, valid dice expression
const COMPLETE_REGEX = /^\+?(?:(?:(\d*[dD]\d+)([-+](?:\d*[dD]\d+))*([-+]\d+)?)|([-+]?\d+))?$/

// RegEx for one part of a dice expression
const PART_REGEX = /([-+](?:\d*[dD]\d+|\d+))/g

// RegEx for a dice expression part consisting of 'd0' dice
const D0_REGEX = /^[-+]\d*[dD]0$/

// RegEx for a dice expression part consisting of 'd1' dice
const D1_REGEX = /^([-+])(\d*)[dD]1$/

// RegEx for a dice expression part that represents a die roll, and not a constant
const DICE_PART_REGEX = /^([-+])(\d*)[dD](\d+)$/

const isValidDiceExpression = (input: string) => COMPLETE_REGEX.test(input)

const toMatches = (pattern: RegExp) => (input: string) => {
  const regex = new RegExp(pattern, 'g')
  const matches = [] as string[]
  let match
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[0])
  }

  return matches
}

const simplifyZeroes = (part: string) => D0_REGEX.test(part) ? '+0' : part

const simplifyOnes = (part: string) => {
  const match = part.match(new RegExp(D1_REGEX))
  return match === null
    ? part
    : isEmpty(match[2])
      ? parseInt(`${match[1]}1`) // no dice count provided, prepend the sign and parse
      : parseInt(`${match[1]}${match[2]}`) // parse sign+dice count
}

const createDieExpression = (sign: string, number: string, size: string) => ({
  ...(sign === '-' ? { multiplier: -1 } : {}),
  diceNumber: isEmpty(number) ? 1 : parseInt(number),
  size: parseInt(size),
})

const createExpressionPart = (part: string) => {
  const match = part.match(new RegExp(DICE_PART_REGEX))
  return match === null
    ? parseInt(part)
    : createDieExpression(match[1], match[2], match[3])
}

const addPart = (rolls: DiceExpressionPart | DiceExpressionPart[] | undefined, roll: DiceExpressionPart) =>
  rolls === undefined
    ? roll
    : isArray(rolls)
      ? [...rolls, roll]
      : [rolls, roll]

const reduceExpression = (result: DiceExpression, part: DiceExpressionPart | number): DiceExpression =>
  isNumber(part)
    ? { ...result, modifier: (result.modifier ?? 0) + part }
    : { ...result, rolls: addPart(result.rolls, part) }

export const parseDiceExpression = (expression: string): DiceExpression => flow(
  // parsing is easier if all parts are uniform and start with a '+'
  transformIf(negate(startsWith('+')), (input: string) => `+${input}`),
  // convert invalid inputs to ''
  transformIf(negate(isValidDiceExpression), stubString),
  // create an array of expression parts, e.g. '+5' or '-2d4'
  toMatches(PART_REGEX),
  // replace d0 expressions with constants
  mapIf(isString, simplifyZeroes),
  // replace d1 expressions with constants
  mapIf(isString, simplifyOnes),
  // convert dice expression strings to DiceExpressionParts
  mapIf(isString, createExpressionPart),
  // combine all values into a complete expression
  reduce(reduceExpression)({ } as DiceExpression)
)(expression)
