import { flow, get, join, map } from 'lodash/fp'

import { Actor, MovementMode, Point } from '@thrashplay/gemstone-model'

export const distance = (value: any) => value === undefined ? 'None' : `${value} ft`
export const movementMode = (mode: MovementMode) => `${mode?.name ?? 'unknown'} (${mode?.multiplier ?? 1}x)`
export const point = ({ x, y }: Point) => `(${Math.round(x)}, ${Math.round(y)})`
export const actorList = (value: Actor[]) => flow(
  map(get('name')),
  join(', ')
)(value)
