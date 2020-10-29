import { ActionCreator } from 'typesafe-actions'

import { ActorStatus, Frame } from '../model/frame'

/** signature for functions that handle player (and AI) intentions */
export type IntentionHandler<TData extends unknown = never, TState extends unknown = any> = (
  actor: ActorStatus,
  context: SimulationContext<TState>,
  data: TData
) => ActionCreator

/** additional context for handling intentions, including frame data and global simulation state */
export interface SimulationContext<TState extends any = any> {
  frame: Frame
  state: TState
}
