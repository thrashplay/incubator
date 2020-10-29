import { IntentionHandlers } from './handlers'

export type OptionalRestParameter<TType> = [TType] extends [undefined] ? [] : [TType]

export type IntentionType<
  TType extends keyof typeof IntentionHandlers = keyof typeof IntentionHandlers,
  THandlerSet extends typeof IntentionHandlers = typeof IntentionHandlers,
  THandler extends (arg1: any, arg2: any, arg3: any) => any = THandlerSet[TType]
> = Parameters<THandler>[2] extends undefined ? {
  type: TType
} : {
  type: TType
  data: Parameters<THandler>[2] extends undefined ? never : Parameters<THandler>[2]
}
