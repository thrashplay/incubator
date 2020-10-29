import { ActionType, createAction } from 'typesafe-actions'

import { CharacterId } from '../character'
import { Point } from '../types'

import { IntentionType } from './state'

export const SimulationActions = {
  /** character added to the simulation */
  characterAdded: createAction('simulation/character-added')<CharacterId>(),

  /** actor has set an intention */
  intentionDeclared: createAction('simulation/actor-declared-intention')<{
    characterId: CharacterId
    intention: IntentionType
  }>(),

  /** actor has moved to a specified position */
  moved: createAction('simulation/actor-moved')<{ characterId: CharacterId; position: Point }>(),
}

export type SimulationAction = ActionType<typeof SimulationActions>
