import { get, has } from 'lodash/fp'
import { Either } from 'monet'

import { isEither } from '../type-predicates'
import { OptionalRestParameter } from '../types'
import { WorldState } from '../world'

import {
  TransformationError,
  TransformationFunction,
  TransformationSet,
  TransformationTypes,
  UniversalTransformationFunction,
} from './types'

/**
 * A TransformationApplicator is a function that updates a WorldState by applying the transform encoded
 * in a TransformationDescriptor to it, and returning the resulting WorldState. The updated WorldState
 * is contained in the right-side of an Either monad. Errors -- such as an unrecognized transformation type
 * or invalid TransformationDescriptor -- are returned in the Either's left side.
 */
export type TransformationApplicator<TTransformations extends TransformationSet = any> = (
  transformation: TransformationTypes<TTransformations>, world: WorldState
) => Either<TransformationError, WorldState>

const applyTransformationFunction = <TParameter extends any = never>(
  fn: TransformationFunction<TParameter> | UniversalTransformationFunction<TParameter>,
  world: WorldState,
  ...parameter: OptionalRestParameter<TParameter>
): Either<TransformationError, WorldState> => {
  const result = fn(world, ...parameter)
  return isEither(result)
    ? result
    : Either.Right(result)
}

/**
 * Creates a TransformationApplicator for a specific set of transformation functions.
 */
export const createTransformationApplicator = <TTransformations extends TransformationSet = any>(
  transformations: TTransformations
): TransformationApplicator<TTransformations> => (transformation, world) => has(transformation.type, transformations)
  ? applyTransformationFunction(transformations[transformation.type], world, get('parameter', transformation))
  : Either.Left(`Unrecognized transformation type: ${transformation.type}`)
