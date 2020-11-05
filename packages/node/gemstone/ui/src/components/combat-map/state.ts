
import { isNil } from 'lodash'

import { calculateScale, PanAndZoomEvent, ToolEvent } from '@thrashplay/canvas-with-tools'
import { Dimensions, Extents } from '@thrashplay/math'

import { SelectMapAreaEvent } from './tools/map-editor'
import { MoveEvent } from './tools/move'
import { SetTargetEvent } from './tools/set-target'

export type SetHighlightsEvent = ToolEvent<'set-highlights', { [k in string]?: boolean }>

export type ToolName = 'attack' | 'move' | 'set-target' | 'zoom-and-pan'
export interface CombatMapState {
  highlights: { [k in string]?: boolean }
}

export const INITIAL_STATE: Omit<CombatMapState, 'extents'> = {
  highlights: {},
}

export interface Action<TType extends string = string, TPayload extends any = any> {
  payload: TPayload
  type: TType
}

export type CombatMapEvent =
  | MoveEvent
  | SetHighlightsEvent
  | SetTargetEvent

export const reducer = (state: CombatMapState, event: CombatMapEvent): CombatMapState => {
  switch (event.type) {
    case 'set-highlights':
      return {
        ...state,
        highlights: event.payload,
      }

    default:
      return state
  }
}
