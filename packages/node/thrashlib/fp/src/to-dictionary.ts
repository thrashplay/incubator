import { get, reduce } from 'lodash/fp'

export const toDictionary = (keyProp: string) => <
  TObject extends unknown = any
>(input: TObject[]) => {
  const reduceToDictionary = (result: Partial<Record<string, TObject>>, value: TObject) => {
    const key: string = get(keyProp)(value)
    return {
      ...result,
      [key]: value,
    }
  }

  return reduce(reduceToDictionary)({ })(input)
}
