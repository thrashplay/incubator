import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../model/character'
import { Point } from '../model/types'

import { IntentionState } from './state'

export const SimulationActions = {
  /** character added to the simulation */
  characterAdded: createAction('simulation/character-added')<CharacterId>(),

  /** actor has set an intention */
  intentionDeclared: createAction('simulation/actor-declared-intention')<{
    characterId: CharacterId
    intention: IntentionState
  }>(),

  /** actor has moved to a specified position */
  moved: createAction('simulation/actor-moved')<{ characterId: CharacterId; position: Point }>(),
}

export type SimulationAction = ActionType<typeof SimulationActions>
