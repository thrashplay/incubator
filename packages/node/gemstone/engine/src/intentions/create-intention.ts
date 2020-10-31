import { head } from 'lodash/fp'

import { IntentionHandlers } from './handlers'
import { OptionalRestParameter } from './helper-types'

export const createIntention = <
  TType extends keyof typeof IntentionHandlers = keyof typeof IntentionHandlers,
  TData extends Parameters<(typeof IntentionHandlers)[TType]>[2] = Parameters<(typeof IntentionHandlers)[TType]>[2],
>(type: TType, ...data: OptionalRestParameter<TData>) => ({
  type: type,
  data: head(data) as TData,
})
