/** An event type dispatched by a UI control. */
export type ViewEvent<TType extends string = string, TPayload extends any = any> = [TPayload] extends [undefined]
  ? {
    type: TType
  } : {
    payload: TPayload
    type: TType
  }

/** Function signature for a view event dispatch target. */
export type ViewEventDispatch<TEvent extends ViewEvent> = (event: TEvent) => void

export interface ToolProps<TState extends unknown, TEvent extends ViewEvent> {
  /** a function used by controls to trigger view-specific state changes */
  dispatchViewEvent: ViewEventDispatch<TEvent>

  /** the current view state */
  viewState: TState
}
