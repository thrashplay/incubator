import { Either } from 'monet'

import { LogEntry } from '../log'
import { WorldState } from '../world-state'

import { OptionalRestParameter } from './type-helpers'

/**
 * Converts a RawTransformationFunction to a TransformationFunction, by wrapping its results in the
 * right side of an Either.
 **/
export const wrapWorldTransformation = <TParameter extends any = never>(
  transformationFunction: RawTransformationFunction<TParameter>
): TransformationFunction<TParameter> =>
  (worldState, ...parameters) => Either.Right(transformationFunction(worldState, ...parameters))

// todo: guard raw transform with a validator
// todo: add entity transformations
