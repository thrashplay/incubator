import { head } from 'lodash'
import { createCustomAction, TypeConstant } from 'typesafe-actions'

import { Dictionary, RecordSet } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'

import { Effect } from './effect'

export type AnyAction = {
  details: unknown
  source: Entity['id']
  target: Entity['id']
  type: TypeConstant
}

/**
 * An Action represents an attempt by one Entity to change the state of another. The type of action indicates
 * the nature of the change being attempted, and different types will have different details to describe how
 * the action is performed -- it's intensity, effectiveness, nature, etc.
 *
 * Every action also has a 'source', which is the entity initiating the action, and a 'target', which is the
 * entity being acted upon.
 */
export type Action<
  TAction extends TypeConstant = TypeConstant,
  TDetails extends Dictionary<string, unknown> = never
> = {
  source: Entity['id']
  target: Entity['id']
  type: TAction
} & ([TDetails] extends [never] ? unknown : { details: TDetails })

// helper type for createActionCreator
type OptionalRestParameter<TType> = [TType] extends [never] ? [] : [TType]

/**
 * Creates a typesafe action creator for a specific Action type.
 *
 * Without 'details':
 *   const createOpenAction = createAction('OPEN')()
 *   const open = createOpenAction('src', 'target')
 *
 * With 'details':
 *   const createJumpAction = createAction('jump')<{ howHigh: number }>()
 *   const jump = createJumpAction('src', 'target', { howHigh: 50 })
 */
export const createAction = <TType extends TypeConstant = TypeConstant>(
  type: TType
) => <TDetails extends Dictionary<string, unknown> = never>() => createCustomAction(type, (
  source: Entity['id'],
  target: Entity['id'],
  ...rest: OptionalRestParameter<TDetails>
) => ({ source, target, details: head(rest) as TDetails }) as unknown as Omit<Action<TType, TDetails>, 'type'>)

/** Result data structure for action handlers. */
export type ActionResult = {
  /** Effects to apply to entity state. */
  effects: Effect[]

  /** Actions to take in response to the original action. */
  responses: Action[]
}

/**
 * An ActionHandler is given the action to handle, as well as the set of all entity records. It is responsible
 * for generating an action result, which is a set of zero or more Actions to take in response, and zero or
 * more effects. Effects are responsible for applying actual updates to the state of entities in the simulation.
 *
 * TODO: handle infinite loops of actions and responses
 */
export type ActionHandler = <TAction extends AnyAction = AnyAction>(
  action: TAction,
  entities: RecordSet<Entity>
) => Effect[]
