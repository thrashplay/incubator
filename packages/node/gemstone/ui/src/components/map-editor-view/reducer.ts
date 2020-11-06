import { getType } from 'typesafe-actions'

import { MapEditorViewEvent, MapEditorViewEvents } from './events'
import { MapEditorViewState } from './state'

export const reducer = (state: MapEditorViewState, event: MapEditorViewEvent): MapEditorViewState => {
  switch (event.type) {
    case getType(MapEditorViewEvents.areaSelected):
      return {
        ...state,
        selectedAreaId: event.payload,
      }

    case getType(MapEditorViewEvents.extentsChanged):
      return {
        ...state,
        extents: event.payload,
      }

    case getType(MapEditorViewEvents.toolSelected):
      return {
        ...state,
        selectedToolId: event.payload,
      }

    case getType(MapEditorViewEvents.viewportChanged):
      return {
        ...state,
        viewport: event.payload,
      }

    default:
      return state
  }
}
