import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../character'
import { Point } from '../common'

import { IntentionType } from './state'

export const SimulationActions = {
  /** character added to the simulation */
  actorAdded: createAction('simulation/actor-added')<CharacterId>(),

  /** actor has set an intention */
  intentionDeclared: createAction('simulation/actor-declared-intention')<{
    characterId: CharacterId
    intention: IntentionType
  }>(),

  /** actor has moved to a specified position */
  moved: createAction('simulation/actor-moved')<{ characterId: CharacterId; position: Point }>(),

  /** frame's time offset has been changed */
  timeOffsetChanged: createAction('simulator/time-offset-changed')<number>(),
}

export type SimulationAction = ActionType<typeof SimulationActions>
