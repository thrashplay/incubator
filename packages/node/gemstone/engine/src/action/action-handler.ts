import { Either } from 'monet'
import { getType } from 'typesafe-actions'

import { Entity } from '../entity'
import { LogEntry } from '../log'
import { Transformation } from '../transformation'
import { WorldState } from '../world-state'

import { Action } from './action'

export type AnyAction = {
  details?: unknown
  source: Entity['id']
  target: Entity['id']
  type: Action['type']
}

/** Result data structure for action handlers. */
export type ActionResult = {
  /** Actions to take in response to the original action. */
  reactions?: Action | readonly Action[]

  /** Transformations to apply to the world state. */
  transformations?: Transformation<string, any> | readonly Transformation<string, any>[]
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
) => Either<LogEntry, ActionResult>

/**
 * An action handler exposes two functions:
 *
 *  - 'supports', which is used to determine if the handler knows how to handle the specified action
 *  - 'handle', which is the ActionHandlerFunction that will handle supported actions
 *
 */
export type ActionHandler<TAction extends AnyAction = any> = {
  handle: (action: TAction, world: WorldState) => Either<LogEntry, ActionResult>
  supports: (action: AnyAction) => boolean
}

/**
 * Creates an ActionHandler that has a builtin type guarantee, and will not call the 'handler' function
 * unless the acton being handled has the same type as the requested action creator.
 */
export const createActionHandler = <TAction extends AnyAction = any>(
  actionCreator: (...args: any) => TAction,
  handler: ActionHandlerFunction<TAction>
): ActionHandler<TAction> => {
  const supportedType = getType(actionCreator)

  const supports = (action: AnyAction) => action.type === supportedType
  const handle = (action: TAction, world: WorldState) => supports(action)
    ? handler(action, world)
    : Either.Left<LogEntry, ActionResult>(
      `[ERROR] Handler for '${supportedType}' actions called with invalid action: ${action}`
    )

  return {
    handle,
    supports,
  }
}
