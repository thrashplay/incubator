export const createReducerErrorHandler = <TState extends unknown = any>(
  reducerName: string,
  state: TState
) => (action: string, ...rest: any[]) => {
  // eslint-disable-next-line no-console
  console.error(`[${reducerName}:${action}]`, ...rest)
  return state
}
