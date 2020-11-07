import { castArray, isString, reduce } from 'lodash/fp'

import { DiceExpression, DiceExpressionPart } from './dice-expression'
import { getRandomNumber } from './get-random-number'
import { parseDiceExpression } from './parse-dice-expression'

const rollRecursive = (
  total: number,
  multiplier: number,
  dieSize: number,
  diceRemaining: number
): number => {
  const newTotal = total + (multiplier * getRandomNumber(dieSize))
  return diceRemaining <= 1
    ? newTotal
    : rollRecursive(newTotal, multiplier, dieSize, diceRemaining - 1)
}

const reduceDiceExpression = (result: number, { diceNumber, multiplier, size }: DiceExpressionPart) =>
  rollRecursive(result, multiplier ?? 1, size, diceNumber ?? 1)

const doRoll = (dice: DiceExpression) => {
  return dice.rolls === undefined
    ? dice.modifier ?? 0
    : reduce(reduceDiceExpression)(dice.modifier ?? 0)(castArray(dice.rolls))
}

export const roll = (expression: string | DiceExpression): number => {
  return isString(expression)
    ? roll(parseDiceExpression(expression))
    : doRoll(expression)
}
