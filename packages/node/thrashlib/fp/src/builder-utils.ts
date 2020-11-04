import { flow, get, omit, size, slice, toString } from 'lodash/fp'

import { BuilderFunction, mapAt } from '@thrashplay/fp'

type Dictionary<K extends string | number | symbol = string, T = unknown>
  = Partial<Record<K, T>>

/**
 * Creates an updated dictionary by adding the specified item, using the named
 * prop as it's key (default: 'id')
 * */
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

/** Creates an updated dictionary by removing the item with the specified key */
export const removeItem = <
  TKey extends number | string | symbol = any,
  TItems extends Dictionary<TKey, any> = any,
>(
  items: TItems,
  keyToRemove: TKey
): Omit<TItems, TKey> => omit(keyToRemove, items)

/** Creates an updated dictionary by changing the item with the specified key */
export const updateItem = <
  TItem extends Record<string, unknown> = any,
  TKey extends number | string | symbol = any,
>(
  items: Dictionary<TKey, TItem>,
  keyToUpdate: TKey,
  ...updaters: BuilderFunction<TItem>[]
) => ({
  ...items,
  [keyToUpdate]: flow(...updaters)(items[keyToUpdate]) as TItem,
})

/** Creates a new array by appending the specified item to the end of it. */
export const add = <T extends any = any>(items: T[], newItem: T) => [...items, newItem]

/** Creates a new array by removing the item at the given index from the source */
export const remove = <T extends any = any>(items: T[], index: number) => [
  ...slice(0, index)(items),
  ...slice(index + 1, size(items))(items),
]

/** Creates a new array by changing the item at the given index */
export const update = <T extends any = any>(
  items: T[],
  index: number,
  ...updaters: BuilderFunction<T>[]
) => mapAt(index, flow(...updaters))(items) as T[]
