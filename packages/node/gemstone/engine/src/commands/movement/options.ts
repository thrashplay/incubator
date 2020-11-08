import _ from 'lodash'

import { Action } from '../../actions'
import { GameState } from '../../state'
import { Command } from '../../store'

export interface MovementOptions {
  // minimum distance to try and maintain from a movement destination, defaults to zero
  minimumDistance: number

  // command to execute when a movement is completed, defaults to a noop
  onArrival: Command<GameState, Action>
}

const DEFAULT_OPTIONS: MovementOptions = {
  minimumDistance: 0,
  onArrival: () => [],
}

export const withDefaultOptions = (
  options: Partial<MovementOptions> = {}
): MovementOptions => _.merge({}, DEFAULT_OPTIONS, options)
