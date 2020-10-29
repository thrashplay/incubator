import { head } from 'lodash'

import { IntentionHandlers } from './handlers'
import { IntentionType, OptionalRestParameter } from './helper-types'

export const createIntention = <
  TType extends keyof typeof IntentionHandlers = keyof typeof IntentionHandlers,
  TData extends Parameters<(typeof IntentionHandlers)[TType]>[2] = Parameters<(typeof IntentionHandlers)[TType]>[2],
>(type: TType, ...data: OptionalRestParameter<TData>) => ({
  type: type,
  data: head(data) as TData,
})

export type Intention =
  IntentionType<'move'>
  | IntentionType<'wait'>
