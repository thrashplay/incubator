import { Either } from 'monet'

import { LogEntry } from '../log'
import { WorldState } from '../world-state'

import { OptionalRestParameter } from './type-helpers'

/**
 * A Transformation encodes a parameterized change to the simulation's World state. It has a string representing
 * the type of transformation, a function that is able to calculate updated state, and an optional type-specific
 * parameter value.
 */
export type Transformation<
  TType extends string = string,
  TParameter extends any = never
> = {
  transformFunction: (world: WorldState, ...parameter: OptionalRestParameter<TParameter>) => WorldState
  type: TType
} & ([TParameter] extends [never] ? unknown : { parameter: TParameter })

/** Error type for failed Transformations */
export type TransformationError = LogEntry

/** Signature for transformation functions that return Either an error, or updated world state. */
export type TransformationFunction<TParameter extends any = never> = (
  world: WorldState,
  ...parameters: OptionalRestParameter<TParameter>
) => Either<TransformationError, WorldState>

/** Signature for transformation functions that will never fail, and always return an updated world state. */
export type RawTransformationFunction <TParameter extends any = never> = (
  world: WorldState,
  ...parameters: OptionalRestParameter<TParameter>
) => WorldState

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
