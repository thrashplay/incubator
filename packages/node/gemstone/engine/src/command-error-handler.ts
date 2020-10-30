const NoOp = []

export const error = (...args: any[]) => {
  console.error(...args)
  return NoOp
}
