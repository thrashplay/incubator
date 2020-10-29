export type MovementModeId = string

export interface MovementMode {
  id: MovementModeId
  name: string
  multiplier: number
}

export interface RulesState {
  movement: {
    defaultMode: MovementModeId
    modes: Record<MovementModeId, MovementMode>
  }
  segmentDuration: number
}

export interface RulesStateContainer {
  rules: RulesState
}
