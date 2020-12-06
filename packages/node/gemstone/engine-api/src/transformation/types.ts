import { Either } from 'monet'

import { LogEntry } from '../log'
import { NthArgOrNever, OptionalRestParameter } from '../types'
import { WorldState } from '../world'

/**
 * A TransformationDescriptor encodes a parameterized change to the simulation's World state. It has a string
 * representing the type of transformation, and an optional type-specific parameter value.
 */
export type TransformationDescriptor<
  TType extends string = string,
  TParameter extends any = never
> = {
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
export type UniversalTransformationFunction <TParameter extends any = never> = (
  world: WorldState,
  ...parameters: OptionalRestParameter<TParameter>
) => WorldState

export type TransformationSet = Readonly<{
  [k in string]: TransformationFunction<any> | UniversalTransformationFunction<any>
}>

/**
 * The union of all possible Transformation shapes handled by a collection of TransformationFunctions.
 * Each type in this union, which is a type of 'Transformation' has the following characteristics
 *
 *   - its "TType" is a key in the set of transformation functions
 *   - its "TParameter" is the type of parameter taken by the corresponding transformation function, or
 *     'never' if there isn't one
 *
 **/
export type TransformationTypes<
  TTransformations extends TransformationSet = any
> = ({
  [K in keyof TTransformations]: TTransformations[K] extends (
    world: WorldState, ...rest: any[]
  ) => ReturnType<TransformationFunction> | ReturnType<UniversalTransformationFunction>
    ? TransformationDescriptor<K & string, NthArgOrNever<TTransformations[K], 1>>
    : TransformationDescriptor<K & string, unknown>
})[keyof TTransformations]
