export interface Action<TType extends string = string, TPayload extends any = any> {
  payload: TPayload
  type: TType
}

export type CombatMapEvent =
  | MoveEvent
  | SetHighlightsEvent
  | SetTargetEvent
