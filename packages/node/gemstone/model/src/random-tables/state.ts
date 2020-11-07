import { Dictionary } from '../common'

export type TableRollerFunction<TResult extends unknown = any> = () => TResult

export interface RandomTable<TResult extends unknown = any> {
  /** unique ID for this table */
  id: string

  /** Dice expression used to roll on this table */
  diceExpression: string

  /**
   * Default result if one does not exist, if -- for example -- the results array
   * is not exhaustive for the dice expression
   **/
  defaultResult: TResult

  /** Human-readable name of this table */
  name: string

  /** Lookup table mapping roll values to the corresponding result */
  results: Dictionary<number, TResult>
}

export type RandomTableSet = Dictionary<string, RandomTable>

export interface RandomTablesStateContainer {
  tables: RandomTableSet
}
