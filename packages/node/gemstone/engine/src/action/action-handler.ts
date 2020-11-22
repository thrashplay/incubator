import { Entity } from '../entity'
import { Effect } from '../transformation'
import { EMPTY_ARRAY, WorldState } from '../world'

import { Action } from './action'

export type AnyAction = {
  details: unknown
  source: Entity['id']
  target: Entity['id']
  type: Action['type']
}

/** Result data structure for action handlers. */
export type ActionResult = {
  /** Actions to take in response to the original action. */
  reactions: Action[]

  /** Transformations to apply to the world state. */
  transformations: Effect[]
}

/**
 * An ActionHandlerFunction is given the action to handle, as well as the world state. It is responsible
 * for generating an action result, which is a set of zero or more reactions (themselves Actions) to take
 * in response, and zero or more transformations. Transformations are ultimately responsible for applying
 * updates to the world state.
 */
export type ActionHandlerFunction<TAction extends AnyAction = AnyAction> = (
  action: TAction,
  world: WorldState
) => ActionResult

/**
 * An action handler exposes two functions:
 *
 *  - 'supports', which is used to determine if the handler knows how to handle the specified action
 *  - 'handle', which is the ActionHandlerFunction that will handle supported actions
 *
 */
export type ActionHandler<TAction extends AnyAction = any> = {
  supports: (action: AnyAction) => action is TAction
  handle: ActionHandlerFunction<TAction>
}

export const EMPTY_ACTION_RESULT: ActionResult = {
  reactions: EMPTY_ARRAY,
  transformations: EMPTY_ARRAY,
} as const
