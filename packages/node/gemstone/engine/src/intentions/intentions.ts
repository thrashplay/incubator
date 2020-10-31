import { get, head } from 'lodash/fp'

import { ActorStatus, FrameAction } from '@thrashplay/gemstone-model'

import { IntentionHandlers } from './handlers'
import { OptionalRestParameter, TypeOfIntention } from './helper-types'
import { SimulationContext } from './types'

export const createIntention = <
  TType extends keyof typeof IntentionHandlers = keyof typeof IntentionHandlers,
  TData extends Parameters<(typeof IntentionHandlers)[TType]>[2] = Parameters<(typeof IntentionHandlers)[TType]>[2],
>(type: TType, ...data: OptionalRestParameter<TData>) => ({
  type: type,
  data: head(data) as TData,
})

export const createIntentionHandler = <TState extends any = any>(
  context: SimulationContext<TState>
) => (actor: ActorStatus): FrameAction | FrameAction[] => {
  const NOOP = () => []

  const { intention } = actor
  const handler = get(intention.type)(IntentionHandlers) ?? NOOP
  return handler(actor, context, get('data')(intention))
}

export type Intention =
  TypeOfIntention<'follow'>
  | TypeOfIntention<'idle'>
  | TypeOfIntention<'melee'>
  | TypeOfIntention<'move'>
  | TypeOfIntention<'wait'>
