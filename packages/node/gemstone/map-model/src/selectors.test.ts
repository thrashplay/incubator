import { Extents } from '@thrashplay/math'

import { buildMap, forMapSelector, MapBuilder } from './builders/map-data'
import { buildSquareRoom, RoomBuilder } from './builders/room'
import { getAreaAtPosition } from './selectors'

const create = forMapSelector

const { addArea } = MapBuilder
const { set: setOnRoom } = RoomBuilder

const createOneRoomMap = (x = 0, y = 0, width = 1000, height = 1000) => create(
  buildMap(
    addArea(
      buildSquareRoom(
        { x, y, width, height },
        setOnRoom({ id: 'test-room' })
      )
    )
  )
)

const createTwoRoomMap = (bounds1: Extents, bounds2: Extents) => create(
  buildMap(
    addArea(buildSquareRoom(bounds1, setOnRoom({ id: 'test-room-1' }))),
    addArea(buildSquareRoom(bounds2, setOnRoom({ id: 'test-room-2' })))
  )
)

describe('map selectors', () => {
  describe('getAreaAtPosition', () => {
    // all these tests assume we are querying the location '(100, 100)'
    const params = { position: { x: 100, y: 100 } }

    test('no areas in map', () => {
      const state = create(buildMap())
      const result = getAreaAtPosition(state, params)
      expect(result).toBeUndefined()
    })

    test('no matching areas', () => {
      const state = createOneRoomMap(101, 50, 100, 100)
      const result = getAreaAtPosition(state, params)
      expect(result).toBeUndefined()
    })

    test('one matching area', () => {
      const state = createOneRoomMap(100, 50, 100, 100)
      const result = getAreaAtPosition(state, params)
      expect(result).toEqual(state.map.areas['test-room'])
    })

    test('multiple matching areas', () => {
      const state = createTwoRoomMap(
        { x: 100, y: 50, width: 100, height: 100 },
        { x: 0, y: 0, width: 1000, height: 1000 }
      )

      const result = getAreaAtPosition(state, params)
      expect(result).not.toBeUndefined()
    })
  })
})
