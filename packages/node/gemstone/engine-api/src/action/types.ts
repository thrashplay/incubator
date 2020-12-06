import { Either } from 'monet'

import { Dictionary } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'
import { LogEntry } from '../log'
import { TransformationDescriptor } from '../transformation'
import { WorldState } from '../world'

/**
 * An Action represents an attempt by one Entity to change the state of another. The type of action indicates
 * the nature of the change being attempted, and different types will have different details to describe how
 * the action is performed -- it's intensity, effectiveness, nature, etc.
 *
 * Every action also has a 'source', which is the entity initiating the action, and a 'target', which is the
 * entity being acted upon.
 */
export type Action<
  TAction extends string = string,
  TDetails extends Dictionary<string, unknown> = never
> = {
  source: Entity['id']
  target: Entity['id']
  type: TAction
} & ([TDetails] extends [never] ? unknown : { details: TDetails })

/** The widest possible type for an object we know is some kind of action. */
export type AnyAction = {
  details?: unknown
  source: Entity['id']
  target: Entity['id']
  type: Action['type']
}

/** Error type for failed Actions */
export type ActionError = LogEntry

/** Result data structure for action handlers. */
export type ActionResult = {
  /** Actions to take in response to the original action. */
  reactions?: Action | readonly Action[]

  /** Transformations to apply to the world state. */
  transformations?: TransformationDescriptor<string, any> | readonly TransformationDescriptor<string, any>[]
}

/**
 * Signature for ActionHandlerFunctions, which handle an action in the context of the a current world state.
 *
 * An ActionHandlerFunction is given the action to handle, as well as the world state. It is responsible
 * for generating an action result, which is a set of zero or more reactions (themselves Actions) to take
 * in response, and zero or more transformations. Transformations are ultimately responsible for applying
 * updates to the world state.
 */
export type ActionHandlerFunction<TAction extends AnyAction = AnyAction> = (
  action: TAction,
  world: WorldState
) => Either<ActionError, ActionResult>

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
