import { ActionType } from 'typesafe-actions'

import { createAction } from '@thrashplay/gemstone-engine'

import { WORLD_ID } from '../../world-state'

export const WorldActions = {
  /** Action sent to advance the world time by one tick. */
  tick: createAction('tick')(),
}

export const WORLD_TICK_ACTION = WorldActions.tick(WORLD_ID, WORLD_ID)

export type WorldActions = ActionType<typeof WorldActions>
