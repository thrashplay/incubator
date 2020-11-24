import { castArray, map } from 'lodash/fp'
import { Either } from 'monet'

import { Action, ActionResult } from '../action'
import { EMPTY_ARRAY } from '../constants'
import { Entity, getEntity } from '../entity'
import { LogEntry } from '../log'
import { createStateChange, StateChange, WorldState } from '../world-state'

import { ActionResponderFactory } from './action-responder-factory'

/**
 * Executes a single action, returning a set of changes to apply to the world state, or a LogEntry describing
 * why the action could not be executed.
 *
 * @see ../../docs/executeAction.png for a visual depiction of the execution flow
 */
export type ActionExecutor = (action: Action, world: WorldState) => Either<LogEntry, readonly StateChange[]>

/** Creates an ActionExecutor, using the specified responder factory to create action responder for entities. */
export const createActionExecutor = (actionResponderFactory: ActionResponderFactory): ActionExecutor => {
  return (action: Action, world: WorldState) => {
    const entityOrError = getEntity(world)(action.target)
      .cata<Either<string, Entity>>(
      () => Either.Left(`Unknown target: '${action.target}'.`),
      (entity: Entity) => Either.Right(entity)
    )

    return entityOrError
      .map((entity) => actionResponderFactory(entity))
      .flatMap((handler) => handler.supports(action)
        ? handler.handle(action, world)
        : Either.Left<LogEntry, ActionResult>(
          `'${action.target}' does not know how to respond to action '${action.type}'.`
        )
      )
      .map((actionResult) => map(createStateChange)(castArray(actionResult.transformations ?? EMPTY_ARRAY)))
  }
}
