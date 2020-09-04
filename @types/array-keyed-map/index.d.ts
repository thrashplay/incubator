declare module 'array-keyed-map' {
  class ArrayKeyedMap<TKey extends any[] = any[], TValue extends any = unknown> {
    size: number

    constructor()
    set(path: TKey, value: TValue): void
    has(path: TKey): boolean
    get(path: TKey): TValue
    delete(path: TKey): void
    clear(): void
    hasPrefix(path: TKey): boolean
    * entries(): Iterable<[TKey, TValue]>
    * keys(): Iterable<TKey>
    * values(): Iterable<TValue>
    foreach(callback: any, thisArg: any): void
  }

  export = ArrayKeyedMap
}
