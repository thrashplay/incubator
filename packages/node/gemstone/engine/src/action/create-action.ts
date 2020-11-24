import { head } from 'lodash'
import {
  ActionCreatorTypeMetadata,
  createCustomAction,
  ActionCreator as TypesafeActionsActionCreator,
} from 'typesafe-actions'

import { Dictionary } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'

import { Action } from './action'

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
export const createAction = <TType extends Action['type'] = Action['type']>(
  type: TType
) => <TDetails extends Dictionary<string, unknown> = never>() => createCustomAction(type, (
  source: Entity['id'],
  target: Entity['id'],
  ...rest: OptionalRestParameter<TDetails>
) => ({ source, target, details: head(rest) as TDetails }) as unknown as Omit<Action<TType, TDetails>, 'type'>)

/** Type of action creator functions, used to build other types. */
export type ActionCreator<
  TType extends Action['type'] = Action['type']
> = TypesafeActionsActionCreator<TType> & ActionCreatorTypeMetadata<TType>
