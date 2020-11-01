export type ToolEvent<TType extends string = string, TPayload extends any = any> = [TPayload] extends [undefined]
  ? {
    type: TType
  } : {
    payload: TPayload
    type: TType
  }

export type ToolEventDispatch<TEvent extends ToolEvent> = (event: TEvent) => void
