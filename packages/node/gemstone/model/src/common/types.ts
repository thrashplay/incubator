/** simple type definitions used by the various state interfaces */

import { isFinite } from 'lodash/fp'

export interface Point {
  x: number
  y: number
}

export const isValidPoint = (point: any): point is Point => {
  const { x, y } = point ?? {}
  return isFinite(x) && isFinite(y)
}
