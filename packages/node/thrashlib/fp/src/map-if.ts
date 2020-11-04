import { map } from 'lodash/fp'

import { transformIf } from './transform-if'

/**
 * Creates an array of values by iterating over the specified collection. For each item:
 *  - if `predicate` returns true for that item, the value will be transformed via `transform`
 *  - if `predicate` returns false for that item, the value will be unchanged
 */
export const mapIf = <T, TResult>(
  predicate: (value: T) => boolean, transform: (value: T) => TResult
) => (collection: T[] | null | undefined): (T | TResult)[] => {
  return map(transformIf(predicate, transform))(collection)
}
