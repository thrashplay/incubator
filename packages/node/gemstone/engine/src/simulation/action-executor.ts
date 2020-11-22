import { Either } from 'monet'

import { Action } from '../action'
import { LogEntry } from '../log'
import { StateChange, WorldState } from '../world-state'

import { ActionHandlerFactory } from './action-handler-factory'

/**
 * Executes a single action, returning a set of changes to apply to the world state, or a LogEntry describing
 * why the action could not be executed.
 *
 * @see ../../docs/executeAction.png for a visual depiction of the execution flow
 */
export type ActionExecutor = (action: Action, world: WorldState) => Either<LogEntry, StateChange[]>

/** Creates an ActionExecutor, using the specified handler factory to create action handlers for entities. */
export const createActionExecutor = (_actionHandlerFactory: ActionHandlerFactory): ActionExecutor => {
  return (_action: Action, _world: WorldState) => {
    return Either.Left('Action execution is not implemented yet!')
  }
}
