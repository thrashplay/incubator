import { has } from 'lodash/fp'

import { Point } from '@thrashplay/math'

import { applyIf } from '../api/effect'

import { setPosition } from './mutators'

/** Moves the Positionable entity to a new location. */
export const moveTo = (destination: Point) => applyIf(has('position'), setPosition(destination))
