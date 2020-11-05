export const getNextId = (base: string) => {
  let id = 1
  return () => `${base}/${id++}`
}
