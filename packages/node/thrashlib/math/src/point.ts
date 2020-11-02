export type Point = { x: number; y: number }

export const point = (x: number, y: number) => ({ x, y })
export const Origin = point(0, 0)
