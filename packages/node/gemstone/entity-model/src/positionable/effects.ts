import { has } from 'lodash/fp'

import { applyIf } from '@thrashplay/gemstone-engine'
import { Point } from '@thrashplay/math'

import { setPosition } from './mutators'

/** Moves the Positionable entity to a new location. */
export const moveTo = (destination: Point) => applyIf(has('position'), setPosition(destination))
