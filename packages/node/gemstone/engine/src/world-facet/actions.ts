import { Either } from 'monet'
import { ActionType } from 'typesafe-actions'

import { createAction } from '@thrashplay/gemstone-engine'

import { WORLD_ID } from '../constants'

import { createActionHandler } from './../action'
import { WorldTransformations } from './transformations'

export const WorldActions = {
  /** Action sent to advance the world time by one tick. */
  tick: createAction('tick')(),
}
export type WorldActions = ActionType<typeof WorldActions>

/** Handler for 'tick' world actions that transforms the target by advancing its time one tick. */
export const tickHandler = createActionHandler(
  WorldActions.tick,
  ({ target }) => Either.Right({
    transformations: WorldTransformations.advanceTime(target, 1),
  })
)

export const WORLD_TICK_ACTION = WorldActions.tick(WORLD_ID, WORLD_ID)
