import { Either } from 'monet'

import { AnyFunction, NthArgOrNever, OptionalRestParameter } from '../types'
import { WorldState } from '../world'

import { TransformationDescriptor, TransformationError, TransformationSet, TransformationTypes } from './types'

export type Transformations<TTransformations extends TransformationSet = any> = {
  apply: (
    transformation: TransformationTypes<TTransformations>,
    world: WorldState
  ) => Either<TransformationError, WorldState>
  create: <TType extends keyof TTransformations & string, TFunction extends AnyFunction = TTransformations[TType]>(
    type: TType,
    ...parameter: OptionalRestParameter<NthArgOrNever<TFunction, 1>>
  ) => TransformationDescriptor<TType, NthArgOrNever<TFunction, 1>>
}

need a function to create one of these