import { flow, isFunction, tail } from 'lodash/fp'

/** used to differentiate 'builder function' args from 'initial value' args */
type NotFunction = { apply?: never }

export type FactoryFunctionWithoutArgs<TResult extends unknown = any> = () => TResult

export type FactoryFunctionWithArgs<
  TResult extends unknown = any,
  TArgs extends unknown = any
> = (args: TArgs) => TResult

export type BuilderFunction<TProduct extends unknown = any> = (input: TProduct) => TProduct

// Helper type for the createBuilder function
type MaybeOptionalOpenEndedTuple<TFirst, TRest> =
  [TFirst] extends [never]
    ? TRest[]
    : [TFirst, ...TRest[]]

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
  ...args: MaybeOptionalOpenEndedTuple<TInitialValues & NotFunction, BuilderFunction<TResult>>
): TResult => {
  const firstArg = args[0]
  const builders = (isFunction(firstArg) ? args : tail(args)) as BuilderFunction<TResult>[]

  return isFunction(firstArg)
    ? flow(...builders)((factory as FactoryFunctionWithoutArgs<TResult>)())
    : flow(...builders)(factory(args[0] as TInitialValues))
}
