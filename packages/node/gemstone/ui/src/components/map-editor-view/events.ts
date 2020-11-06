import { ActionType, createAction } from 'typesafe-actions'

import { Area } from '@thrashplay/gemstone-map-model'
import { Dimensions, Extents } from '@thrashplay/math'

export const MapEditorViewEvents = {
  areaSelected: createAction('map-editor/area-selected')<Area['id'] | undefined>(),
  extentsChanged: createAction('map-view/extents-changed')<Extents>(),
  toolSelected: createAction('map-view/tool-selected')<string>(),
  viewportChanged: createAction('map-view/viewport-changed')<Dimensions | undefined>(),
}

export type MapEditorViewEvent = ActionType<typeof MapEditorViewEvents>
