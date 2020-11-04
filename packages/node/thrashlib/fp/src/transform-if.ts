/**
 * Transforms the input by invoking the specified transform function, if and only if `predicate`
 * returns true for the input. Otherwise, the input is returned unchanged.
 */
export const transformIf = <T, TResult>(
  predicate: (value: T) => boolean, transform: (value: T) => TResult) => (value: T
) => {
  const res = predicate(value) ? transform(value) : value
  return res
}
