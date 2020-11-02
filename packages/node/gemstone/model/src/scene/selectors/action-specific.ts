import { createSelector } from 'reselect'

import { Origin } from '@thrashplay/math'

import { isValidPoint } from '../../common'

import { getAction, getPosition } from './actor-status'

export const getDestination = createSelector(
  [getAction, getPosition],
  (action, position) =>
    action?.type === 'move' && isValidPoint(action?.data)
      ? action?.data
      : (position ?? Origin)
)
