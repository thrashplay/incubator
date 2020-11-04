import { Dictionary } from '../common'

export type MovementModeId = string

export interface MovementMode {
  id: MovementModeId
  name: string
  multiplier: number
}

export interface RuleSet {
  /** distance, in feet, that is considered "in melee" */
  meleeRange: number
  movement: {
    defaultMode?: MovementModeId
    modes: Dictionary<MovementModeId, MovementMode>
  }
  segmentDuration: number
}

export interface RulesStateContainer {
  rules: RuleSet
}
