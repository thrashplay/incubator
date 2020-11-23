export type OptionalRestParameter<TType> = [TType] extends [never] ? [] : [TType]
