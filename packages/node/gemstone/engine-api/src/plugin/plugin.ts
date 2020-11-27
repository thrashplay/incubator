import { Either } from 'monet'

import { TransformationError } from '../transformation'
import { OptionalRestParameter } from '../type-helpers'
import { AnyFunction, Dictionary } from '../types'
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

export type GemstonePlugin = Readonly<{
  id: string
  transformations?: Readonly<{ [k in string]: TransformationFunction }>
}>

/** Prepends the plugin ID to an identifier string as a namespace, unless the plugin is in the union of plugin IDs specified by TExcludedPlugins */
type ScopedIdentifier<
TScope extends string, 
TIdentifier extends string | number,
TExcludedPlugins extends string = 'gemstone-core'
> = TScope extends TExcludedPlugins
  ? TIdentifier
  : `${TScope}/${TIdentifier}`

type NoParameter = unknown
export type TransformationTypes<TPlugin extends GemstonePlugin> = ({
  [K in keyof TPlugin['transformations']]: TPlugin['transformations'][K] extends (world: WorldState, ...rest: any[]) => ReturnType<TransformationFunction>
    ? [Parameters<TPlugin['transformations'][K]>[1]] extends [undefined]
      ? { type: ScopedIdentifier<TPlugin['id'], K & string> } //  & string is a hack to force 'symbol' to be a string
      : { type: ScopedIdentifier<TPlugin['id'], K & string>; parameter: Parameters<TPlugin['transformations'][K]>[1] }
    : NoParameter
})[keyof TPlugin['transformations']]

const plugin = {
  id: 'test',
  transformations: {
    upone: (world: WorldState) => world,
    uptwo: (world: WorldState, arg: string) => ({ ...world, name: arg }),
    upthree: (world: WorldState, _: { complex: boolean; name: string }) => world,
  },
} as const
todo the above totally afails without 'as const'

const register = <T extends GemstonePlugin>(plugin: Readonly<T>): TransformationTypes<T> => null as unknown as TransformationTypes<T>
const bleh = register(plugin)

const r = bleh.type

type T0 = TransformationTypes<typeof plugin>
type T1 = (typeof plugin)['transformations'][keyof (typeof plugin)['transformations']]
type T2 = typeof plugin
type T3 = keyof (typeof plugin)['transformations']