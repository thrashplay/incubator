import { initial, last } from 'lodash'

/**
 * Maps the last value in an array to a new value, by passing it to the given 'mapFunc'.
 * This returns a new array, with all values the same and the last item mapped. If the array is empty,
 * then an empty array is returned.
 */
export const mapLast = <T extends any = any, TResult extends any = any>(
  mapFunc: (item: T) => TResult) => (items: T[]
) => {
  const firstItems = initial(items)
  const lastItem = last(items)

  return lastItem
    ? [...firstItems, mapFunc(lastItem)]
    : firstItems
}
