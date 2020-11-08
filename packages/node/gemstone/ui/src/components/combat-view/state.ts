import { Actor } from '@thrashplay/gemstone-model'
import { feetToPixels } from '@thrashplay/gemstone-ui-core'
import { Dimensions, Extents } from '@thrashplay/math'

export interface CombatViewState {
  extents: Extents
  highlights: { [k in string]?: boolean }
  selectedActorId?: Actor['id']
  selectedToolId: string
  viewport?: Dimensions
}

export const DEFAULT_EXTENTS = {
  height: feetToPixels(120),
  width: feetToPixels(120),
  x: feetToPixels(-60),
  y: feetToPixels(-60),
}

export const INITIAL_STATE: CombatViewState = {
  extents: DEFAULT_EXTENTS,
  highlights: {},
  selectedToolId: 'pan-and-zoom',
}
