import { Extents } from '@thrashplay/math'

import { buildMap, forMapSelector, MapBuilder } from './builders/map-data'
import { RoomBuilder } from './builders/rooms'
import { buildVerticalWall, WallBuilder } from './builders/walls'
import { getAreaAtPosition, getWall, getWallLength } from './selectors'
import { Thing } from './state'

const create = forMapSelector

const { addRectangularRoom, addThing } = MapBuilder
const { set: setOnRoom } = RoomBuilder
const { set: setOnWall } = WallBuilder

const createOneRoomMap = (x = 0, y = 0, width = 1000, height = 1000) => create(
  buildMap(
    addRectangularRoom({ x, y, width, height }, 5, setOnRoom({ id: 'test-room' }))
  )
)

const createTwoRoomMap = (bounds1: Extents, bounds2: Extents) => create(
  buildMap(
    addRectangularRoom(bounds1, 1, setOnRoom({ id: 'test-room-1' })),
    addRectangularRoom(bounds2, 1, setOnRoom({ id: 'test-room-2' }))
  )
)

const createStateWithThing = (thing: Thing) => create(buildMap(addThing(thing)))

const wallWithLength10 = buildVerticalWall({
  length: 10,
  thickness: 1,
  x: 0,
  y: 0,
}, setOnWall({ id: 'wall-with-length-10' }))

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

  describe('getWall', () => {
    it('returns the requested wall', () => {
      const state = createStateWithThing(wallWithLength10)
      const result = getWall(state, { thingId: wallWithLength10.id })
      expect(result).toEqual(wallWithLength10)
    })

    it('returns undefined if the wall does not exist', () => {
      const state = create(buildMap())
      const result = getWall(state, { thingId: wallWithLength10.id })
      expect(result).toBeUndefined()
    })

    it('returns undefined if the thing ID is not a wall', () => {
      const state = createStateWithThing({
        id: wallWithLength10.id,
        kind: 'not-a-wall',
      })

      const result = getWall(state, { thingId: wallWithLength10.id })
      expect(result).toBeUndefined()
    })
  })

  describe('getWallLength', () => {
    it('returns the requested wall\'s length', () => {
      const state = createStateWithThing(wallWithLength10)
      const result = getWallLength(state, { thingId: wallWithLength10.id })
      expect(result).toBeCloseTo(10)
    })

    it('returns 0 if the wall does not exist', () => {
      const state = create(buildMap())
      const result = getWallLength(state, { thingId: wallWithLength10.id })
      expect(result).toBe(0)
    })

    it('returns undefined if the thing ID is not a wall', () => {
      const state = createStateWithThing({
        id: wallWithLength10.id,
        kind: 'not-a-wall',
      })

      const result = getWallLength(state, { thingId: wallWithLength10.id })
      expect(result).toBe(0)
    })
  })
})
