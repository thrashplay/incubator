export type XY = { x: number; y: number }

export type Point = XY

export const point = (x: number, y: number) => ({ x, y })
export const Origin = point(0, 0)
