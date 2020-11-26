import { Validation } from 'monet'

/**
 * Validator function that asserts an input value is 'valid' based on implementation-specific rules. If the
 * input is invalid, a left-handed Either is returned, containing an error of type TError. If the input is
 * valid, it may (optionally) be narrowed to a subtype of the input before returned as a right-handed Either.
 */
export type Validator<
  I extends any = unknown,
  O extends I = I,
  TError extends any = string
> = (arg: I) => Validation<TError, O>
