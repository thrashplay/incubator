import { ActionHandlers } from './handlers'

export type OptionalRestParameter<TType> = [TType] extends [undefined] ? [] : [TType]

export type TypeOfAction<
  TType extends keyof typeof ActionHandlers = keyof typeof ActionHandlers,
  THandlerSet extends typeof ActionHandlers = typeof ActionHandlers,
  THandler extends (arg1: any, arg2: any, arg3: any) => any = THandlerSet[TType]
> = Parameters<THandler>[2] extends undefined ? {
  type: TType
} : {
  type: TType
  data: Parameters<THandler>[2] extends undefined ? never : Parameters<THandler>[2]
}
