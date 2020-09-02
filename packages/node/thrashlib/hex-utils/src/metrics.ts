import { HexOrientationType } from './types'

/**
 * Metric (size and spacing) data for hexagons using a particular layout.
 *
 * See: https://www.redblobgames.com/grids/hexagons/#basics
 */
export interface HexMetrics {
  /** distance from the center of a hexagon the midpoint of it's side */
  apothem: number

  /** Distance between the midpoint of one edge to the midpoint of the opposite edge; equal to 2 * apothem */
  diameter: number

  /** the height of a hexagon */
  height: number

  /** horizontal distance between the center points of adjacent hexagons */
  horizontalDistance: number

  /** orientation of the hexagons described by these metrics ('Flat' or 'Pointy') */
  orientation: HexOrientationType

  /** Alias of 'apothem' */
  radius: number

  /** the length of a hexagon side */
  sideLength: number

  /** vertical distance between the center points of adjacent hexagons */
  verticalDistance: number

  /** the width of a hexagon */
  width: number
}

const SQRT3 = Math.sqrt(3)
export const createMetrics = (orientation: HexOrientationType, sideLength: number) => ({
  apothem: (sideLength * SQRT3) / 2,
  diameter: sideLength / SQRT3,
  height: orientation === 'Flat' ? SQRT3 * sideLength : 2 * sideLength,
  horizontalDistance: orientation === 'Flat' ? (2 * sideLength) * 3 / 4 : SQRT3 * sideLength,
  orientation,
  radius: (sideLength * SQRT3) / 2,
  sideLength,
  verticalDistance: orientation === 'Flat' ? SQRT3 * sideLength : (2 * sideLength) * 3 / 4,
  width: orientation === 'Flat' ? 2 * sideLength : SQRT3 * sideLength,
})
