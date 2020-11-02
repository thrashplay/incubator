import { ActionCreator } from 'typesafe-actions'

import { ActorStatus, Frame } from '@thrashplay/gemstone-model'

import { TypeOfAction } from './helper-types'

/** signature for functions that handle player (and AI) actions */
export type ActionHandler<TData extends unknown = never, TState extends unknown = any> = (
  actor: ActorStatus,
  context: SimulationContext<TState>,
  data: TData
) => ActionCreator

/** additional context for handling actions, including frame data and global simulation state */
export interface SimulationContext<TState extends any = any> {
  frame: Frame
  state: TState
}

export type Action =
| TypeOfAction<'attack'>
| TypeOfAction<'follow'>
| TypeOfAction<'idle'>
| TypeOfAction<'move'>
| TypeOfAction<'wait'>
