import { has, head } from 'lodash'
import { LodashFlow } from 'lodash/fp'
import { Validation } from 'monet'
import { createCustomAction } from 'typesafe-actions'

import { Entity } from '../entity'
import { WorldState, WorldStateBuilders } from '../world-state'

import { Transformation } from './transformation'
import { OptionalRestParameter } from './type-helpers'

const { updateEntity } = WorldStateBuilders

/**
 * Creates a typesafe Transformation creator for transformations that modify the state of a single entity.
 */
export const createEntityTransformation = <
  TType extends Transformation['type'] = Transformation['type'],
  TParameter extends any = never
>(
  type: TType,
  transformFunction: (entity: Entity, ...parameter: OptionalRestParameter<TParameter>) => Entity
) => createCustomAction(type, (
  entityId: Entity['id'],
  ...rest: OptionalRestParameter<TParameter>
) => {
  return {
    transformFunction: (world: WorldState, ...parameter: OptionalRestParameter<TParameter>) => {
      const transformWithParameter = (entity: Entity) => transformFunction(entity, ...parameter)
      return updateEntity(entityId, transformWithParameter)(world)
    },
    parameter: head(rest) as TParameter,
  } as unknown as Omit<Transformation<TType, TParameter>, 'type'>
})

export type EntityValidator<
  TInput extends Entity = any,
  TOutput extends TInput = any
> = (entity: TInput) => entity is TOutput

// interface LodashFlow<T extends any> {
//   <I extends T, R1, R2, R3, R4, R5, R6, R7>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7): (...args: A) => R7
//   <I extends T, R1, R2, R3, R4, R5, R6, R7>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7, ...func: Array<lodash.Many<(a: any) => any>>): (...args: A) => any
//   <I extends T, R1, R2, R3, R4, R5, R6>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6): (...args: A) => R6
//   <I extends T, R1, R2, R3, R4, R5>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5): (...args: A) => R5
//   <I extends T, R1, R2, R3, R4>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4): (...args: A) => R4
//   <I extends T, R1, R2, R3>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3): (...args: A) => R3
//   <I extends T, R1, R2>(f1: (...args: A) => R1, f2: (a: R1) => R2): (...args: A) => R2
//   (...func: Array<lodash.Many<(...args: any[]) => any>>): (...args: any[]) => any
// }

type MapFunction<I = any, O = any> = (arg: I) => O
type MapChainResult<T extends MapFunction[]> = T extends [(...args: any[]) => infer TReturnType]
  ? TReturnType
  : T extends [first: infer TFirst, ...rest: infer TRest]
    ? TFirst extends (...args: any[]) => any
      ? TRest extends [MapFunction<ReturnType<TFirst>, any>, ...MapFunction[]]
        ? MapChainResult<TRest>
        : 1
      : 2
    : 3

const bleh = (_: number) => true
const bleh2 = (_: boolean) => 'string'
const bleh3 = (_: string) => 5

type NarrowingFunction<I = any, O extends I = I> = (arg: I) => arg is O
type XXXNarrowingChainResult<T extends MapFunction[]> = T extends [(...args: any[]) => infer TReturnType]
  ? TReturnType
  : T extends [first: infer TFirst, ...rest: infer TRest]
    ? TFirst extends (...args: any[]) => any
      ? TRest extends [MapFunction<ReturnType<TFirst>, any>, ...MapFunction[]]
        ? MapChainResult<TRest>
        : 1
      : 2
    : 3

const bleh = (_: number) => true
const bleh2 = (_: boolean) => 'string'
const bleh3 = (_: string) => 5

type T1 = MapChainResult<[typeof bleh, typeof bleh2, typeof bleh3]>

type AnyRecord = Record<string, unknown>
type Person = { name: string }
type Employee = Person & { employeeId: string }

const isObject = (anything: unknown): anything is AnyRecord => typeof anything === 'object' && anything !== null
const isPerson: NarrowingValidator<AnyRecord, Person> = (record: AnyRecord): record is Person => 'name' in record
const isEmployee = (person: Person): person is Employee => 'employeeId' in person

const isValidEmployeeId = (employee: Employee): employee is Employee => {
  const superSecretHash = `HASHED(${employee.name})`
  return ('employeeId' in employee)
    ? employee.employeeId === superSecretHash
    : false
}

type NarrowingValidator<I = any, O extends I = I> = (arg: I) => arg is O

// TChainResult = T extends [NarrowingValidator<any, any>]
// ? T
// : T extends [
//   NarrowingValidator<any, infer TOutput>,
//   NarrowingValidator<infer TOutput, any>,
//   ...NarrowingValidator[]
// ]
//   ? T extends [first: NarrowingValidator, ...rest: infer TRest]
//     ? TRest extends NarrowingValidator[]
//       ? ValidationChain<TRest>
//       : 'impossible 1'
//     : 'impossible 2'
//   : 'outputs dont match inputs'

type ValidatorFn = <
  TArgs extends [NarrowingValidator, NarrowingValidator] = any,
  TInput extends any = TArgs extends [NarrowingValidator<infer TFirst, infer TMiddle>, NarrowingValidator<infer TMiddle, infer TLast>]
    ? TFirst
    : 'invalid 1'
>(...args: TArgs) => TChainResult

type ValidationChainResult<TValidators extends NarrowingValidator[] = any> =
  TValidators extends [(arg: any) => arg is infer TFinalResult]
    ? TFinalResult
    : never

type AnyTypePredicate = (arg: any) => arg is any
type InvalidChainConstruction<
  T extends AnyTypePredicate = any,
  TPredicate = T extends (arg: any) => arg is infer TResult ? TResult : 123
> = 'Invalid chain construction at: ' & TPredicate

type NarrowingValidatorChainResult<T extends NarrowingValidator[]> = T extends [(arg: any) => arg is infer TReturnType]
  ? TReturnType
  : T extends [first: infer TFirst, ...rest: infer TRest]
    ? TFirst extends (arg: any) => arg is infer TResult
      ? TRest extends [NarrowingValidator<TResult, any>, ...NarrowingValidator[]]
        ? NarrowingValidatorChainResult<TRest>
        : 1
      : 2
    : 3

const isValid = <
  TValidators extends NarrowingValidator[] = any,
  TResult = NarrowingValidatorChainResult<TValidators>
>(...validators: TValidators) => (value: unknown): value is TResult => {
  const isValidRecursive = (value: unknown, ...validators: NarrowingValidator[]): boolean => {
    return validators.length === 0
      ? true
      : validators[0](value) && isValidRecursive(value, ...validators.slice(1, 1))
  }

  return isValidRecursive(value, ...validators)
}

type ValidationChain<
  TInput extends any = unknown,
  TResult extends TInput = any,
  TRest extends NarrowingValidator[] = any
> = TRest extends []
  ? [NarrowingValidator<TInput, TResult>]
  : TRest extends [NarrowingValidator<TInput, TResult>]
    ? 1
    : 2

type InvalidValidatorChain = 'Invalid validator chain:'
type ValidationChainStructure<TValidators extends NarrowingValidator[] = any> =
  TValidators extends []
    ? [unknown, unknown]
    : TValidators extends [NarrowingValidator<infer I, infer O>]
      ? [I, O]
      : TValidators extends [first: NarrowingValidator<infer FI, infer FO>, ...rest: infer TRest]
        ? TRest extends [NarrowingValidator<FO, any>, ...NarrowingValidator[]]
          ? [FI, ValidationChainStructure<TRest>[1]]
          : never
        : never

type ValidationChainInput<
  TValidators extends NarrowingValidator[] = any,
> = ValidationChainStructure<TValidators> extends [infer I, any] ? I : InvalidValidatorChain

type ValidationChainOutput<
  TValidators extends NarrowingValidator[] = any,
> = ValidationChainStructure<TValidators> extends [any, infer O] ? O : InvalidValidatorChain

const isValid2 = <
  TValidators extends NarrowingValidator[] = any,
  TInput extends unknown = ValidationChainInput<TValidators>,
  TOutput extends unknown = ValidationChainOutput<TValidators>,
  TResult extends TInput = TOutput extends TInput ? TOutput : never
>(...validators: TValidators) => (value: TInput): value is TResult => {
  const isValidRecursive = (value: unknown, ...validators: NarrowingValidator[]): boolean => {
    return validators.length === 0
      ? true
      : validators[0](value) && isValidRecursive(value, ...validators.slice(1, 1))
  }

  return isValidRecursive(value, ...validators)
}

const value: unknown = undefined
const validator = isValid2(
  isObject,
  isEmployee
)

if (validator(value)) {
  console.log(value.employeeId)
} else {
  console.log('not an employee')
}

// export type EntityValidationChain =
// LodashFlow
