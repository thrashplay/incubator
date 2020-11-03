export type Dictionary<T, K extends string | number | symbol = string> = Partial<Record<K, T>>
