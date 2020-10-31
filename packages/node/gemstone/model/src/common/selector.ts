export const createParameterSelector = <TResult, TParams>(
  selector: (params?: TParams) => TResult
) => (_: any, params?: TParams) => selector(params)
