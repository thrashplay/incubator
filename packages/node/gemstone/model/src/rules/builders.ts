import { flow } from 'lodash'

import { toId } from '../common/builder'
import { BuilderFunction } from '../types'

import { MovementMode, MovementModeId, RulesState } from './state'

const DEFAULT_MELEE_RANGE = 10
const DEFAULT_SEGMENT_DURATION = 5

const DEFAULT_RULES: RulesState = {
  meleeRange: DEFAULT_MELEE_RANGE,
  movement: {
    modes: {},
  },
  segmentDuration: DEFAULT_SEGMENT_DURATION,
} as const

export const newMovementMode = (name: string, multiplier = 1, id?: string) => ({
  id: id ?? toId(name),
  multiplier,
  name,
})

export const newRules = () => DEFAULT_RULES

export const buildRules = (
  ...operations: BuilderFunction<RulesState>[]
): RulesState => flow(...operations)(newRules())

export const addMovementMode = (mode: MovementMode) => (rules: RulesState) => ({
  ...rules,
  movement: {
    ...rules.movement,
    modes: {
      ...rules.movement.modes,
      [mode.id]: mode,
    },
  },
})

export const setDefaultMovementMode = (mode: MovementModeId) => (rules: RulesState) => ({
  ...rules,
  movement: {
    ...rules.movement,
    defaultMode: mode,
  },
})
