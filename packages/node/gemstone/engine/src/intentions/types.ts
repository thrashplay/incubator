import { SimulationAction } from '../simulation/actions'
import { Actor, Frame } from '../simulation/state'

/** signature for functions that handle player (and AI) intentions */
export type IntentionHandler<TData extends unknown = never, TState extends unknown = any> = (
  actor: Actor,
  context: SimulationContext<TState>,
  data: TData
) => SimulationAction | SimulationAction[]

/** additional context for handling intentions, including frame data and global simulation state */
export interface SimulationContext<TState extends unknown = never> {
  frame: Frame
  state: TState
}
