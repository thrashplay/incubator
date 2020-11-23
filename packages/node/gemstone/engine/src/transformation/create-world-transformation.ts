import { head } from 'lodash'
import { createCustomAction } from 'typesafe-actions'

import { WorldState } from '../world-state'

import { Transformation } from './transformation'
import { OptionalRestParameter } from './type-helpers'

/**
 * Creates a typesafe Transformation creator for transformations that modify the global world state
 * outside of any entity, or multiple entities at once.
 *
 * Without 'details':
 *   const createTransformation = createWorldTransformation(
 *     'transform-something',
 *     (world: WorldState) => calculateNewState())
 *   )
 *   const tx = createTransformation()
 *
 * With 'details':
 *   const createTransformation = createWorldTransformation(
 *     'transform-something',
 *     (world: WorldState, param: number) => calculateNewState(param)
 *   )
 *   const tx = createTransformation(5)
 */
export const createWorldTransformation = <
  TType extends Transformation['type'] = Transformation['type'],
  TParameter extends any = never
>(
  type: TType,
  transformFunction: (world: WorldState, ...parameter: OptionalRestParameter<TParameter>) => WorldState
) => createCustomAction(type, (
  ...rest: OptionalRestParameter<TParameter>
) => ({
  transformFunction,
  parameter: head(rest) as TParameter,
}) as unknown as Omit<Transformation<TType, TParameter>, 'type'>)
