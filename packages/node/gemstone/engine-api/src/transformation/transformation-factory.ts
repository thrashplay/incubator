import { AnyFunction, NthArgOrNever, OptionalRestParameter } from '../types'

import { TransformationDescriptor, TransformationSet } from './types'

/**
 * A typesafe factory for generating TransformationDescriptor objects.
 */
export type TransformationFactory<
  TTransformations extends TransformationSet = any,
> = <
  TType extends keyof TTransformations & string,
  TFunction extends AnyFunction = TTransformations[TType]
>(
  type: TType,
  ...parameter: [unknown] extends [TFunction] ? [] | [any] : OptionalRestParameter<NthArgOrNever<TFunction, 1>>
) => TransformationDescriptor<TType, NthArgOrNever<TFunction, 1>>

/**
 * Creates a TransformationFactory for a specific set of transformation functions.
 */
export const createTransformationFactory = <
  TTransformations extends TransformationSet = any
>(): TransformationFactory<TTransformations> => (type, ...parameter) => ({
  parameter: parameter[0],
  type,
}) as any
