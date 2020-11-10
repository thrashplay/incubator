import { Area } from '@thrashplay/gemstone-map-model'
import { feetToPixels } from '@thrashplay/gemstone-ui-core'
import { Dimensions, Extents } from '@thrashplay/math'

export interface MapEditorViewState {
  extents: Extents
  selectedAreaId?: Area['id']
  selectedToolId: string
  viewport?: Dimensions
}

export const DEFAULT_EXTENTS = {
  height: feetToPixels(255),
  width: feetToPixels(275),
  x: feetToPixels(-60),
  y: feetToPixels(-205),
}

export const INITIAL_STATE: MapEditorViewState = {
  extents: DEFAULT_EXTENTS,
  selectedToolId: 'select',
}
