import { drop, dropRight, flow, size } from 'lodash/fp'

// returns the middle of an array
// if array.length < 3, an empty array is returned
// if array.length >= 3, returns the array after dropping the first and last items
export const takeMiddle = <T extends any = any>(items: T[]) => size(items) < 3 ? [] : flow(
  drop(1),
  dropRight(1),
)(items)