/** simple type definitions used by the various state interfaces */

import { isFinite } from 'lodash/fp'

export type Dictionary<K extends string | number | symbol = string, T = unknown> = Partial<Record<K, T>>

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
