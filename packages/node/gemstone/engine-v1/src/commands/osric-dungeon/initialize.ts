import { buildRandomTable, RandomTableBuilder, RandomTablesEvents } from '@thrashplay/gemstone-model'

const { addResult, addResults } = RandomTableBuilder

const roomTypeTables = buildRandomTable(
  {
    defaultResult: 'osric-dungeon-2(a)',
    diceExpression: '1d2',
    id: 'osric-dungeon-room-types',
    name: 'Room Type Tables',
  },
  addResult(1, 'osric-dungeon-2(a)'),
  addResult(2, 'osric-dungeon-2(b)')
)

const rooms = buildRandomTable(
  {
    defaultResult: { width: 30, height: 30 },
    diceExpression: '1d20',
    id: 'osric-dungeon-2(a)',
    name: 'Rooms',
  },
  addResult(1, { width: 10, height: 10 }),
  addResults(2, 4, { width: 20, height: 20 }),
  addResults(5, 7, { width: 30, height: 30 }),
  addResults(8, 10, { width: 40, height: 40 }),
  addResult(11, { width: 10, height: 20 }),
  addResults(12, 13, { width: 20, height: 30 }),
  addResults(14, 15, { width: 20, height: 40 }),
  addResults(16, 17, { width: 30, height: 40 }),
  // this is 'special' in the actual book
  addResults(18, 20, { width: 50, height: 50 })
)

const chambers = buildRandomTable(
  {
    defaultResult: { width: 20, height: 40 },
    diceExpression: '1d20',
    id: 'osric-dungeon-2(b)',
    name: 'Chambers',
  },
  addResult(1, { width: 10, height: 20 }),
  addResults(2, 4, { width: 20, height: 20 }),
  addResults(5, 6, { width: 30, height: 30 }),
  addResults(7, 8, { width: 40, height: 40 }),
  addResults(9, 10, { width: 20, height: 30 }),
  addResults(11, 13, { width: 20, height: 40 }),
  addResults(14, 15, { width: 40, height: 50 }),
  addResults(16, 17, { width: 40, height: 60 }),
  // this is 'special' in the actual book
  addResults(18, 20, { width: 60, height: 60 })
)

const numberOfExits = buildRandomTable(
  {
    defaultResult: { breakpoint: 500, small: 1, large: 2 },
    diceExpression: '1d20',
    id: 'osric-dungeon-5',
    name: 'Number of Exits',
  },
  addResults(1, 4, { breakpoint: 500, small: 1, large: 2 }),
  addResults(5, 7, { breakpoint: 500, small: 2, large: 3 }),
  addResults(8, 9, { breakpoint: 500, small: 3, large: 4 }),
  // change for secret doors in small...
  addResults(10, 12, { breakpoint: 1000, small: 0, large: 1 }),
  addResults(13, 15, { breakpoint: 1500, small: 0, large: 1 }),
  addResults(16, 19, { breakpoint: 0, small: '1d4', large: '1d4' }),
  // swap door/passage...
  addResult(20, { breakpoint: 500, small: 1, large: 1 })
)

// cooler data entry:
// `
// result | breakpoint | small | large
// 1-4    | 500        | 1     | 2
// 5-7    | 500        | 2     | 3
// 8-9    | 500        | 3     | 4
// 10-12  | 100        | 0     | 1
// 13-15  | 1500       | 0     | 1
// 16-19  | 0          | 1d4   | 1d4
// 20     | 0          | 1     | 1
// `,

const exitLocation = buildRandomTable(
  {
    defaultResult: 'opposite',
    diceExpression: '1d20',
    id: 'osric-dungeon-6',
    name: 'Exit Location',
  },
  addResults(1, 4, 'left'),
  addResults(5, 12, 'opposite'),
  addResults(13, 16, 'right'),
  addResults(17, 20, 'same')
)

const general = buildRandomTable(
  {
    defaultResult: '',
    diceExpression: '1d20',
    id: 'osric-dungeon-18',
    name: 'General',
  }
)

const passageWidth = buildRandomTable(
  {
    defaultResult: 10,
    diceExpression: '1d20',
    id: 'osric-dungeon-22',
    name: 'Passage Width',
  },
  addResult(1, 5),
  addResults(2, 13, 10),
  addResults(14, 17, 20),
  addResult(18, 30),
  // this is 'special' in the actual book
  addResults(19, 20, 40)
)

export const initialize = () => (state: GameState) => [
  RandomTablesEvents.tableCreated(roomTypeTables),
  RandomTablesEvents.tableCreated(rooms),
  RandomTablesEvents.tableCreated(chambers),
  RandomTablesEvents.tableCreated(numberOfExits),
  RandomTablesEvents.tableCreated(exitLocation),
  RandomTablesEvents.tableCreated(passageWidth),
]
