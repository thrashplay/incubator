import { get } from 'lodash/fp'

import { ActorStatus, FrameAction } from '@thrashplay/gemstone-model'

import { IntentionHandlers } from './handlers'
import { SimulationContext } from './types'

export const createIntentionHandler = <TState extends any = any>(
  context: SimulationContext<TState>
) => (actor: ActorStatus): FrameAction | FrameAction[] => {
  const NOOP = () => []

  const { intention } = actor
  const handler = get(intention.type)(IntentionHandlers) ?? NOOP
  return handler(actor, context, get('data')(intention))
}
