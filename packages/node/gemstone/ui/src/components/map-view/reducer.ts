import { ActionType, createAction, getType } from 'typesafe-actions'

import { Dimensions, Extents } from '@thrashplay/math'

import { MapViewState } from './map-view-state'

export const MapViewEvents = {
  extentsChanged: createAction('map-view/extents-changed')<Extents>(),
  toolSelected: createAction('map-view/tool-selected')<string>(),
  viewportChanged: createAction('map-view/viewport-changed')<Dimensions | undefined>(),
}

export type MapViewEvent = ActionType<typeof MapViewEvents>

export const reducer = (state: MapViewState, event: MapViewEvent): MapViewState => {
  switch (event.type) {
    case getType(MapViewEvents.extentsChanged):
      return {
        ...state,
        extents: event.payload,
      }

    case getType(MapViewEvents.toolSelected):
      return {
        ...state,
        selectedToolId: event.payload,
      }

    case getType(MapViewEvents.viewportChanged):
      return {
        ...state,
        viewport: event.payload,
      }

    default:
      return state
  }
}
