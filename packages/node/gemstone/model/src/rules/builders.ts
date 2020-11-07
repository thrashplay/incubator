import { get } from 'lodash/fp'

import { createBuilder } from '@thrashplay/fp'

import { AtLeastOneOfIdOrName } from '../common'
import { toId } from '../common/builder'

import { MovementMode, MovementModeId, RuleSet } from './state'

const DEFAULT_MELEE_RANGE = 5
const DEFAULT_SEGMENT_DURATION = 5

const DEFAULT_RULES: RuleSet = {
  meleeRange: DEFAULT_MELEE_RANGE,
  movement: {
    modes: {},
  },
  segmentDuration: DEFAULT_SEGMENT_DURATION,
} as const

export type InitialMovementModeValues = AtLeastOneOfIdOrName & { multiplier?: number }

/**
 * Builder function for MovementMode instances
 * At least one of name or id is required. If only one is given, we use it to derive the other.
 */
export const buildMovementMode = createBuilder(({
  multiplier,
  ...initial
}: InitialMovementModeValues): MovementMode => ({
  id: get('id')(initial) ?? toId(get('name')(initial)),
  multiplier: multiplier ?? 1,
  name: get('name')(initial) ?? get('id')(initial),
}))

/** Builder function for Rules instances. */
export const buildRules = createBuilder(() => DEFAULT_RULES)

/** Builder function for RulesStateContainer instances, useful for selector tests */
export const forRulesSelector = createBuilder((rules: RuleSet) => ({ rules }))

const addMovementMode = (mode: MovementMode) => (rules: RuleSet) => ({
  ...rules,
  movement: {
    ...rules.movement,
    modes: {
      ...rules.movement.modes,
      [mode.id]: mode,
    },
  },
})

const setDefaultMovementMode = (mode: MovementModeId) => (rules: RuleSet) => ({
  ...rules,
  movement: {
    ...rules.movement,
    defaultMode: mode,
  },
})

export const MovementModeBuilder = {
  set: (values: Partial<MovementMode>) => (initial: MovementMode) => ({ ...initial, ...values }),
}

export const RuleSetBuilder = {
  addMovementMode,
  set: (values: Partial<RuleSet>) => (initial: RuleSet) => ({ ...initial, ...values }),
  setDefaultMovementMode,
}
