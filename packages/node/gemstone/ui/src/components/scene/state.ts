
import { isNil } from 'lodash'

import { calculateScale, PanAndZoomEvent, ToolEvent } from '@thrashplay/canvas-with-tools'
import { Dimensions, Extents } from '@thrashplay/math'

import { MoveEvent } from './tools/move'
import { SetTargetEvent } from './tools/set-target'

export type SetHighlightsEvent = ToolEvent<'set-highlights', { [k in string]?: boolean }>

export type ToolName = 'attack' | 'move' | 'set-target' | 'zoom-and-pan'
export interface MapViewState {
  extents: Extents
  highlights: { [k in string]?: boolean }
  selectedToolId: string
  viewport?: Dimensions
}

export const INITIAL_STATE: Omit<MapViewState, 'extents'> = {
  highlights: {},
  selectedToolId: 'pan-and-zoom',
}

export interface Action<TType extends string = string, TPayload extends any = any> {
  payload: TPayload
  type: TType
}

export type MapViewAction =
  Action<'select-tool', string>
  | Action<'set-viewport', Dimensions>
  | PanAndZoomEvent
  | MoveEvent
  | SetHighlightsEvent
  | SetTargetEvent

// calculates new extents whenever the viewport changes
// current implementation is to ??
const adjustExtents = (extents: Extents, oldViewport: Dimensions | undefined, newViewport: Dimensions) => {
  // if we didn't have an old viewport, center the extents in the current viewport by adjusting for aspect ratio
  if (isNil(oldViewport)) {
    const scale = calculateScale(extents, newViewport)

    const extentsWidthInPixels = extents.width * scale
    const extentsHeightInPixels = extents.height * scale
    const extraPixelWidth = newViewport.width - extentsWidthInPixels
    const extraPixelHeight = newViewport.height - extentsHeightInPixels
    const extraWidth = extraPixelWidth / scale
    const extraHeight = extraPixelHeight / scale

    return {
      x: extents.x - extraWidth / 2,
      y: extents.y - extraHeight / 2,
      width: extents.width + extraWidth,
      height: extents.height + extraHeight,
    }
  } else {
    return extents
  }
}

export const reducer = (state: MapViewState, event: MapViewAction): MapViewState => {
  switch (event.type) {
    case 'canvas/pan-and-zoom':
      return {
        ...state,
        extents: event.payload.extents,
      }

    case 'select-tool':
      return {
        ...state,
        selectedToolId: event.payload,
      }

    case 'set-highlights':
      return {
        ...state,
        highlights: event.payload,
      }

    case 'set-viewport': {
      return {
        ...state,
        extents: adjustExtents(state.extents, state.viewport, event.payload),
        viewport: event.payload,
      }
    }

    default:
      return state
  }
}
