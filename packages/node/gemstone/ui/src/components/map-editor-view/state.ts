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
  height: feetToPixels(120),
  width: feetToPixels(120),
  x: feetToPixels(-60),
  y: feetToPixels(-60),
}

export const INITIAL_STATE: MapEditorViewState = {
  extents: DEFAULT_EXTENTS,
  selectedToolId: 'select',
}
