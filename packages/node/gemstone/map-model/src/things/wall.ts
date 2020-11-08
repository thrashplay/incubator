import { Point } from '@thrashplay/math'

import { Thing } from '../state'

/**
 * The type of break in a wall:
 *
 *   - passage: a simple, full-sized opening without a door or other barricade
 */
export type BreakType = 'passage'

/** Represents an opening in a wall, such as a door, window, passage, etc. */
export interface Break {
  /** Type of break, such as a door or passage. */
  kind: BreakType

  /** Position of the break's centerpoint, given as a distance along the wall from it's starting point. */
  position: number

  /** Width of this break in the wall, in feet. */
  length: number
}

export interface Wall extends Thing {
  /** Breaks in this wall, representing openings such as doors. */
  breaks: Break[]

  /** Type of thing, always 'wall' for Walls */
  kind: 'wall'

  /** the first point (assuming CCW winding) of this wall segment */
  p1: Point

  /** the second point (assuming CCW winding) of this wall segment */
  p2: Point

  /** the thickness of the wall, in feet in the game world */
  thickness: number
}
