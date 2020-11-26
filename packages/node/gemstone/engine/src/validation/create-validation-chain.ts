import { reduce } from 'lodash/fp'
import { Validation } from 'monet'

import {
  ImpossibleValidatorChain,
  InvalidValidatorChainInput,
  ValidationChainInput,
  ValidationChainOutput,
} from './type-helpers'
import { Validator } from './validator'

// createValidationChain overloads
export function createValidationChain(): Validator<unknown, unknown, string>;

export function createValidationChain<
  I extends any,
  R1 extends I = never
>(v1: Validator<I, R1>): Validator<I, R1, string>;

export function createValidationChain<
  I extends any,
  R1 extends I = never,
  R2 extends R1 = never
>(v1: Validator<I, R1>, v2: Validator<R1, R2>): Validator<I, R2, string>;

export function createValidationChain<
  I extends any,
  R1 extends I = never,
  R2 extends R1 = never,
  R3 extends R2 = never
>(
  v1: Validator<I, R1>,
  v2: Validator<R1, R2>,
  v3: Validator<R2, R3>
): Validator<I, R3, string>;

export function createValidationChain<
  I extends any,
  R1 extends I = never,
  R2 extends R1 = never,
  R3 extends R2 = never,
  R4 extends R3 = never
>(
  v1: Validator<I, R1>,
  v2: Validator<R1, R2>,
  v3: Validator<R2, R3>,
  v4: Validator<R3, R4>
): Validator<I, R4, string>;

export function createValidationChain<
  I extends any,
  R1 extends I = never,
  R2 extends R1 = never,
  R3 extends R2 = never,
  R4 extends R3 = never,
  R5 extends R4 = never
>(
  v1: Validator<I, R1>,
  v2: Validator<R1, R2>,
  v3: Validator<R2, R3>,
  v4: Validator<R3, R4>,
  v5: Validator<R4, R5>
): Validator<I, R5, string>;

export function createValidationChain<
  I extends any,
  R1 extends I = never,
  R2 extends R1 = never,
  R3 extends R2 = never,
  R4 extends R3 = never,
  R5 extends R4 = never,
  R6 extends R5 = never
>(
  v1: Validator<I, R1>,
  v2: Validator<R1, R2>,
  v3: Validator<R2, R3>,
  v4: Validator<R3, R4>,
  v5: Validator<R4, R5>,
  v6: Validator<R5, R6>
): Validator<I, R6, string>;

export function createValidationChain<
  I extends any,
  R1 extends I = never,
  R2 extends R1 = never,
  R3 extends R2 = never,
  R4 extends R3 = never,
  R5 extends R4 = never,
  R6 extends R5 = never,
  R7 extends R6 = never
>(
  v1: Validator<I, R1>,
  v2: Validator<R1, R2>,
  v3: Validator<R2, R3>,
  v4: Validator<R3, R4>,
  v5: Validator<R4, R5>,
  v6: Validator<R5, R6>,
  v7: Validator<R6, R7>
): Validator<I, R7, string>;

// EXPERIMENTAL: overload with type checking on an unlimited number of chained validators
// the generics here are 'better than nothing', but fall back to 'never' without useful feedback too often
// since they are only used in the case of >7 validators (handled by the above overloads), we have deferred
// enhancements to this
// TODO: make better generics here
export function createValidationChain <
  TValidators extends [
    Validator,
    Validator,
    Validator,
    Validator,
    Validator,
    Validator,
    Validator,
    Validator,
    ...Validator[]
  ] = any,
  TInput extends unknown = ValidationChainInput<TValidators>,
  TOutput extends unknown = ValidationChainOutput<TValidators>,
  TResult extends TInput = TInput extends InvalidValidatorChainInput | ImpossibleValidatorChain
    ? never
    : TOutput extends TInput ? TOutput : never
> (...validators: TValidators): Validator<TInput, TResult, string>;

/**
 * Creates a composite Validator by chaining together a number of other validators.
 * The input to each validator in the chain must be the output type of the previous validator. If any validator
 * returns a failed Validation instance, then any subsequent validators will not be executed. Thus it is
 * guaranteed that each validator will be called with the expected type, and allows validators that provide
 * increasingly detailed validation to be composed safely.
 **/
export function createValidationChain (...validators: Validator[]): Validator {
  return (value: unknown) => {
    return reduce(
      (result: Validation<string, unknown>, validator: Validator) => result.chain(validator)
    )(Validation.Success(value))(validators)
  }
}
