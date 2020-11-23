import { map } from 'lodash/fp'
import { Either } from 'monet'

import { Action, ActionResult } from '../action'
import { Entity, getEntity } from '../entity'
import { LogEntry } from '../log'
import { createStateChange, StateChange, WorldState } from '../world-state'

import { ActionHandlerFactory } from './action-handler-factory'

/**
 * Executes a single action, returning a set of changes to apply to the world state, or a LogEntry describing
 * why the action could not be executed.
 *
 * @see ../../docs/executeAction.png for a visual depiction of the execution flow
 */
export type ActionExecutor = (action: Action, world: WorldState) => Either<LogEntry, StateChange[]>

/** Creates an ActionExecutor, using the specified handler factory to create action handlers for entities. */
export const createActionExecutor = (actionHandlerFactory: ActionHandlerFactory): ActionExecutor => {
  return (action: Action, world: WorldState) => {
    const entityOrError = getEntity(world)(action.target)
      .cata<Either<string, Entity>>(
      () => Either.Left(`Unknown target: '${action.target}'.`),
      (entity: Entity) => Either.Right(entity)
    )

    const targetId = action.target
    const actionType = action.type

    return entityOrError
      .map((entity) => actionHandlerFactory(entity))
      .flatMap((handler) => handler.supports(action)
        ? Either.Right(handler.handle(action, world))
        : Either.Left<LogEntry, ActionResult>(`'${targetId}' does not know how to respond to action '${actionType}'.`)
      )
      .map((actionResult) => map(createStateChange)(actionResult.transformations))
  }
}
