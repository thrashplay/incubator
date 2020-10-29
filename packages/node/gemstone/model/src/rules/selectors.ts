import { createSelector } from 'reselect'

import { createParameterSelector } from '../common'

import { MovementModeId, RulesStateContainer } from './state'

export interface RulesSelectorParameters {
  movementModeId?: MovementModeId
}

const getMovementModeIdParam = createParameterSelector((params: RulesSelectorParameters) => params.movementModeId)

/** rules selectors */
export const getRules = (state: RulesStateContainer) => state.rules ?? {}

export const getSegmentDuration = createSelector(
  [getRules],
  (rules) => rules.segmentDuration
)

export const getMeleeRange = createSelector(
  [getRules],
  (rules) => rules.meleeRange
)

export const getMovementRules = createSelector(
  [getRules],
  (rules) => rules.movement ?? {}
)

export const getMovementModesCollection = createSelector(
  [getMovementRules],
  (movement) => movement.modes ?? {}
)

/** gets the ID of the rule system's default movement mode */
export const getDefaultMovementModeId = createSelector(
  [getMovementRules],
  (movement) => movement.defaultMode ?? ''
)

/** gets a movement mode with a specified ID */
export const getMovementMode = createSelector(
  [getMovementModesCollection, getMovementModeIdParam],
  (modes, id) => id === undefined ? undefined : modes[id]
)

/** gets the rule system default movement mode */
export const getDefaultMovementMode = createSelector(
  [getMovementModesCollection, getDefaultMovementModeId],
  (modes, id) => modes[id]
)
