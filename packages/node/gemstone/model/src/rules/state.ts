export type MovementModeId = string

export interface MovementMode {
  id: MovementModeId
  name: string
  multiplier: number
}

export interface RulesState {
  /** distance, in feet, that is considered "in melee" */
  meleeRange: number
  movement: {
    defaultMode: MovementModeId
    modes: Record<MovementModeId, MovementMode>
  }
  segmentDuration: number
}

export interface RulesStateContainer {
  rules: RulesState
}
