// TODO: is T | never actually valid, compared to optional/undefined
export type Dictionary<K extends string | number | symbol = string, T = unknown> = { [k in K]: T | never }

export type OptionalRestParameter<TType> =
  [TType] extends [never]
    ? []
    : [TType]

export type AnyFunction = (...args: any[]) => any

/** Returns the type of function T's Nth argument, or never if it that argument's type is undefined */
export type NthArgOrNever<T extends AnyFunction, N extends number> = [Parameters<T>[N]] extends [undefined]
  ? never
  : Parameters<T>[N]
