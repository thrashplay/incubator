import {
  Area,
  getAreaWallIds,
  getWall,
  getWallLength,
  MapEvents,
  Thing,
  WallSide,
} from '@thrashplay/gemstone-map-model'

import { GameState } from '../../state'

export const addExits = (areaId: Area['id'], side: WallSide, widths: number[]) => (state: GameState) => {
  const wallIds = getAreaWallIds(state, { areaId })
}

/**
 * Creates a break in the center of a wall, with the specified length (in feet).
 *
 * TODO: allow the gap to be placed along the wall, but not in the center
 */
export const addBreakInWall = (wallId: Thing['id'], length: number) => (state: GameState) => {
  const wallQuery = { thingId: wallId }

  const wallLength = getWallLength(state, wallQuery)

  // do not add breaks that are longer than the entire wall
  return [
    MapEvents.passageAdded({
      wallId,
      length: Math.min(length, wallLength),
      position: wallLength / 2,
    }),
  ]
}
