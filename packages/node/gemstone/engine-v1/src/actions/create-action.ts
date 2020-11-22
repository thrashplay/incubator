import { head } from 'lodash/fp'

import { ActionHandlers } from './handlers'
import { OptionalRestParameter } from './helper-types'

export const createAction = <
  TType extends keyof typeof ActionHandlers = keyof typeof ActionHandlers,
  TData extends Parameters<(typeof ActionHandlers)[TType]>[2] = Parameters<(typeof ActionHandlers)[TType]>[2],
>(type: TType, ...data: OptionalRestParameter<TData>) => ({
  type: type,
  data: head(data) as TData,
})
