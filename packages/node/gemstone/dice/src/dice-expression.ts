export interface DiceExpressionPart {
  /** The number of dice represented by this expression part, defaulting to 1. */
  diceNumber?: number

  /** The sign for this part, either 1 or -1 (Defaults to 1) */
  multiplier?: number

  /** The size of the die. */
  size: number
}

/** Type representing a dice expression, such as '2d6+1d4+2' */
export interface DiceExpression {
  /** Constant value to add or subtract from the rolls. */
  modifier?: number

  /** Descriptions of the dice rolls in this expression */
  rolls?: DiceExpressionPart | DiceExpressionPart[]
}
