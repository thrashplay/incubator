export const getNextId = (_base: string) => {
  let id = 1
  return () => `${id++}`
}
