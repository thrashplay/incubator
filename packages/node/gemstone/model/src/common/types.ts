/** simple type definitions used by the various state interfaces */

import { isFinite } from 'lodash/fp'

// TODO: is T | never actually valid, compared to optiona/undefined
export type Dictionary<K extends string | number | symbol = string, T = unknown> = { [k in K]: T | never }

export type AtLeastOneOfIdOrName = { id: string } | { name: string} | { id: string; name: string }

export interface Point {
  x: number
  y: number
}

export const ORIGIN = { x: 0, y: 0 }

export const isValidPoint = (point: any): point is Point => {
  const { x, y } = point ?? {}
  return isFinite(x) && isFinite(y)
}
