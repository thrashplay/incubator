export type XY = { x: number; y: number }

export const dot = ({ x: x1, y: y1 }: XY, { x: x2, y: y2 }: XY) => {
  return x1 * x2 + y1 * y2
}

export const multiply = ({ x, y }: XY, scalar: number) => ({
  x: x * scalar,
  y: y * scalar,
})
