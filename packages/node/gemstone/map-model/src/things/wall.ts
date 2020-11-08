import { Point } from '@thrashplay/math'

import { Thing } from '../state'

export interface Wall extends Thing {
  /** the type of thing, always 'wall' for Walls */
  kind: 'wall'

  /** the first point (assuming CCW winding) of this wall segment */
  p1: Point

  /** the second point (assuming CCW winding) of this wall segment */
  p2: Point

  /** the thickness of the wall, in feet in the game world */
  thickness: number
}
