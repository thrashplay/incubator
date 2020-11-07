import { parseDiceExpression } from './parse-dice-expression'
import { roll } from './roll'
export * from './get-random-number'

const Dice = {
  parse: parseDiceExpression,
  roll,
}

export {
  Dice,
  parseDiceExpression,
  roll,
}
