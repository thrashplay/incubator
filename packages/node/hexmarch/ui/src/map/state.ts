
import { Extents, PanAndZoom } from '@thrashplay/canvas-with-tools'
import { AxialCoordinates } from '@thrashplay/hex-utils'

import { SelectTile } from './tools/basic-pointer-tool'
import { ToolName } from './types'

export interface MapViewState {
  extents: Extents
  selectedTile?: AxialCoordinates
  selectedToolName: ToolName
}

export const INITIAL_STATE: Omit<MapViewState, 'extents'> = {
  selectedToolName: 'pointer',
}

export interface Action<TType extends string = string, TPayload extends any = any> {
  payload: TPayload
  type: TType
}

export type MapViewAction =
  Action<'select-tool', ToolName>
  | PanAndZoom
  | SelectTile

export const reducer = (state: MapViewState, action: MapViewAction): MapViewState => {
  switch (action.type) {
    case 'canvas/pan-and-zoom':
      return {
        ...state,
        extents: action.payload.extents,
      }

    case 'select-tile':
      return {
        ...state,
        selectedTile: action.payload,
      }

    case 'select-tool':
      return {
        ...state,
        selectedToolName: action.payload,
      }

    default:
      return state
  }
}
