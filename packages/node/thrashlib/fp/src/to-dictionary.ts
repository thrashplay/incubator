import { get, reduce } from 'lodash/fp'

type SourceObject = Partial<Record<string, any>>
export const toDictionary = <TObject extends SourceObject = SourceObject>(
  keyProp: keyof TObject
) => (input: TObject[]): Partial<Record<string, TObject>> => {
  const reduceToDictionary = (result: Partial<Record<string, TObject>>, value: TObject) => ({
    ...result,
    [get(keyProp)(value)]: value,
  })

  return reduce(reduceToDictionary)({ })(input)
}
