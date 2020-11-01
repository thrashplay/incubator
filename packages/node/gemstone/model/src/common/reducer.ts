export const createReducerErrorHandler = <TState extends unknown = any>(
  reducerName: string,
  state: TState
) => (event: string, ...rest: any[]) => {
  // eslint-disable-next-line no-console
  console.error(`[${reducerName}:${event}]`, ...rest)
  return state
}
