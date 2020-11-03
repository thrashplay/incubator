import { isFunction } from 'lodash'
import { flow, get, kebabCase, toString } from 'lodash/fp'

import { Dictionary } from './types'

export type FactoryFunctionWithoutArgs<TResult extends unknown = any> = () => TResult

export type FactoryFunctionWithArgs<
  TResult extends unknown = any,
  TArgs extends unknown = any
> = (args: TArgs) => TResult

export type BuilderFunction<TProduct extends unknown = any> = (input: TProduct) => TProduct

/** converts a human-readable string to an ID derived from it */
export const toId = (name: string) => kebabCase(name)

/** creates an updated dictionary by adding the specified item, using the named prop as it's key (default: 'id') */
export const addItem = <
  TKey extends number | string | symbol = number | string | symbol,
  T extends any = any
>(items: Dictionary<TKey, T>, newItem: T, idKey = 'id') => {
  const key = toString(get(idKey)(newItem))
  return {
    ...items,
    [key]: newItem,
  }
}

/**
 * Given a factory function that returns a product, this will create a builder for fluently customizing those products.
 *
 * The result is a function which, each time it is called, will create a customized object instance. If the factory
 * function takes an argument, that must be the first argument to the build function. All other arguments are
 * 'BuilderFunction' references, which take an instance of the product and return a customized version of it.
 */
export const createBuilder = <TResult extends unknown = any, TInitialValues extends unknown = never>(
  factory: FactoryFunctionWithArgs<TResult, TInitialValues> | FactoryFunctionWithoutArgs<TResult>
) => (
  firstArg: [TInitialValues] extends [never] ? BuilderFunction<TResult> : TInitialValues,
  ...extraBuilders: BuilderFunction<TResult>[]
): TResult =>
  isFunction(firstArg)
    ? flow(firstArg, ...extraBuilders)((factory as FactoryFunctionWithoutArgs<TResult>)())
    : flow(...extraBuilders)(factory(firstArg as TInitialValues))
