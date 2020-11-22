import { get } from 'lodash/fp'

import { ActorStatus, FrameEvent } from '@thrashplay/gemstone-model'

import { ActionHandlers } from './handlers'
import { SimulationContext } from './types'

export const createActionHandler = <TState extends any = any>(
  context: SimulationContext<TState>
) => (actor: ActorStatus): FrameEvent | FrameEvent[] => {
  const NOOP = () => []

  const { action } = actor
  const handler = get(action.type)(ActionHandlers) ?? NOOP
  return handler(actor, context, get('data')(action))
}
