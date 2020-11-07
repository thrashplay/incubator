import { Area } from '@thrashplay/gemstone-map-model'
import { Dimensions, Extents } from '@thrashplay/math'

export interface MapEditorViewState {
  extents: Extents
  selectedAreaId?: Area['id']
  selectedToolId: string
  viewport?: Dimensions
}

export const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: -250,
  y: -250,
}

export const INITIAL_STATE: MapEditorViewState = {
  extents: DEFAULT_EXTENTS,
  selectedToolId: 'select',
}
