import { Validator } from './validator'

export type InvalidValidatorChainInput = 'Next validator in chain does not have expected input.'
export type InvalidValidatorChainResult = 'Invalid validator chain.'
export type ImpossibleValidatorChain = 'Error parsing validator chain.'
export type ValidationChainStructure<TValidators extends Validator[] = any> =
  TValidators extends []
    ? [any, any]
    : TValidators extends [Validator<infer I, infer O>]
      ? [I, O]
      : TValidators extends [first: Validator<infer FI, infer FO>, ...rest: infer TRest]
        ? TRest extends [Validator<FO, any>, ...Validator[]]
          ? [FI, FO & ValidationChainStructure<TRest>[1]]
          : InvalidValidatorChainInput
        : ImpossibleValidatorChain

export type ValidationChainInput<
  TValidators extends Validator[] = any,
  TStructure = ValidationChainStructure<TValidators>
> = TStructure extends [infer I, any] ? I : InvalidValidatorChainInput

export type ValidationChainOutput<
  TValidators extends Validator[] = any,
> = ValidationChainStructure<TValidators> extends [any, infer O] ? O : InvalidValidatorChainResult
