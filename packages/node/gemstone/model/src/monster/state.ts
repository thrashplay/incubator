import { Dictionary } from '../types'

export type MonsterTypeId = string
export interface MonsterType {
  id: MonsterTypeId
  name: string

  /** the monster's base reach, in feet; defaults to the rule system's default melee range */
  reach?: number

  /**
   * The monster's base size, which is the radius of the circle they occupy (other base shapes to come later).
   * Currently defaults to 3 feet.
   **/
  size?: number

  /** the monster's base speed, in feet of movement per minute */
  speed: number
}

export interface MonsterState {
  types: Dictionary<MonsterTypeId, MonsterType>
}

export interface MonsterStateContainer {
  monsters: MonsterState
}
