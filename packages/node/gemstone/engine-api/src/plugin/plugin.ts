import { Either } from 'monet'

import { createTransformationFactory } from '../transformation/transformation-factory'
import { TransformationError, TransformationTypes } from '../transformation/types'
import { AnyFunction, OptionalRestParameter } from '../types'
import { WorldState } from '../world'

export type TransformationFunction<TParameter extends any = never> = (
  world: WorldState,
  ...parameter: OptionalRestParameter<TParameter>
) => WorldState | Either<TransformationError, WorldState>

export interface TransformationDefinition<
  TType extends string = string,
  TParameter extends any = never
> {
  apply: (
    world: WorldState,
    ...parameter: OptionalRestParameter<TParameter>
  ) => WorldState | Either<TransformationError, WorldState>
  type: TType
}

export type FunctionsById<TFunction extends AnyFunction> = { [k in string]: TFunction }

export type GemstonePlugin = Readonly<{
  transformations?: Readonly<{ [k in string]: TransformationFunction }>
}>

const plugin = {
  transformations: {
    upone: (world: WorldState) => world,
    uptwo: (world: WorldState, arg: string) => ({ ...world, name: arg }),
    upthree: (world: WorldState, _: { complex: boolean; name: string }) => world,
  },
}

// const register = <T extends GemstonePlugin>(
//   _: Readonly<T>
// ): TransformationTypes<T> => null as unknown as TransformationTypes<T>
// const bleh = register(plugin)

// const r = bleh.type

type T0 = TransformationTypes<typeof plugin['transformations']>
type T1 = TransformationTypes<any>
// type T1 = (typeof plugin)['transformations'][keyof (typeof plugin)['transformations']]
// type T2 = typeof plugin
// type T3 = keyof (typeof plugin)['transformations']

const createTransformation = createTransformationFactory<typeof plugin['transformations']>()

const c1 = createTransformation('upone')
const c2 = createTransformation('uptwo', 5)
const c3 = createTransformation('upthree', { complex: true, name: 'bleh' })
