import _ from 'lodash'
import { countBy, flow, identity, mapValues, multiply, times } from 'lodash/fp'

import { getNextAreaId, MapEvents } from '@thrashplay/gemstone-map-model'
import { getSingleResult } from '@thrashplay/gemstone-model'
import { Dimensions } from '@thrashplay/math'

import { GameState } from '../../state'

import { ExitLocation, NumberOfExitsResult } from './types'

const getNumberOfExits = (dimensions: Dimensions, numberOfExits: NumberOfExitsResult) =>
  (dimensions.width * dimensions.height) < numberOfExits.breakpoint
    ? numberOfExits.small
    : numberOfExits.large

export const generateArea = () => (state: GameState) => {
  const roomTypeTable = getSingleResult<string>(state, { tableId: 'osric-dungeon-room-types' })
  const dimensions = getSingleResult<Dimensions>(state, { tableId: roomTypeTable })
  const numberOfExits = getNumberOfExits(
    dimensions,
    getSingleResult<NumberOfExitsResult>(state, { tableId: 'osric-dungeon-5' })
  )

  const getExitLocation = () => getSingleResult<ExitLocation>(state, { tableId: 'osric-dungeon-6' })
  const calculateExitPositions = (exitCount: number) => times(multiply(1 / exitCount))

  // Used to reduce an object with ExitLocation keys, and exit counts (i.e. { left: 3, same: 1 })
  // into an array of exit creation commands
  const reduceExitPositionsToEvents

  const exitPositions = flow(
    times(getExitLocation),
    countBy(identity),
    mapValues(calculateExitPositions)
  )(numberOfExits)

  const roomId = getNextAreaId()

  return [
    MapEvents.rectangularRoomCreated({ bounds: { x: 0, y: 0, ...dimensions }, id: roomId }),

  ]
}
