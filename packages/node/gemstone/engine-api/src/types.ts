// TODO: is T | never actually valid, compared to optional/undefined
export type Dictionary<K extends string | number | symbol = string, T = unknown> = { [k in K]: T | never }

export type OptionalRestParameter<TType> = [TType] extends [never] ? [] : [TType]

export type AnyFunction = (...args: any[]) => any
