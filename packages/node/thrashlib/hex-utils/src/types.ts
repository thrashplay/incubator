/* eslint-disable @typescript-eslint/naming-convention */
export type HexDirection = 0 | 1 | 2 | 3 | 4 | 5

export const HexDirections = {
  Flat: {
    Northeast: 0,
    Southeast: 1,
    South: 2,
    Southwest: 3,
    Northwest: 4,
    North: 5,
  },
  Pointy: {
    Northeast: 0,
    East: 1,
    Southeast: 2,
    Southwest: 3,
    West: 4,
    Northwest: 5,
  },
} as const

export type HexOrientationType = 'Flat' | 'Pointy'
