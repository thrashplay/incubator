// Reference: https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/
// Reference: https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html#monads

import { isNil } from 'lodash'

export type Fn<TIn, TOut> = (input: TIn) => TOut

export type NoValue = null | undefined

/** Interface for the Maybe pseudo-monad. */
export type Maybe<T> = {
  /** Returns the result of calling a function that returns a Maybe, passing it the value from this Maybe. */
  chain: <TOut>(fn: Fn<T, Maybe<TOut>>) => Maybe<TOut>

  /** True if this Maybe wraps a valid value, or false if it is Nothing. */
  exists: boolean

  /**
   * Passes the value wrapped by this Maybe to a function, and returns a Maybe wrapping its result.
   * If this Maybe is None, then None is returned and the function is not called.
   */
  fmap: <TOut>(fn: Fn<T, TOut>) => Maybe<TOut>

  /** Returns the wrapped value of this Maybe, or the supplied default. */
  orElse: (defaultValue: T) => T

  /** Returns this Maybe if it has a value, or the specified default if this object is Nothing. */
  orElseMaybe: (defaultValue: Maybe<T>) => Maybe<T>

  /** Returns the (unsafe) value wrappped by this Maybe, which may be null or undefined. */
  value: T | NoValue
}

class MaybeImpl<T> implements Maybe<T> {
  constructor (private _value: T | NoValue) { }

  public get exists () {
    return !isNil(this.value)
  }

  public get value () {
    return this._value
  }

  public readonly orElse = (defaultValue: T) => this.exists ? this.value as T : defaultValue

  public readonly orElseMaybe = (defaultMaybe: Maybe<T>): Maybe<T> => this.exists ? this : defaultMaybe

  public readonly fmap = <TResult>(fn: Fn<T, TResult>): Maybe<TResult> => {
    return this.exists
      ? just(fn(this.value as T)) // safe to cast, because of isNothing check
      : Nothing as Maybe<TResult>
  }

  public readonly chain = <TResult>(fn: Fn<T, Maybe<TResult>>) => {
    return join(this.fmap(fn))
  }
}

/** Reusable Maybe instance that has no value. */
export const Nothing = new MaybeImpl<any>(undefined)

export const bind = <T, TOut>(fn: Fn<T, Maybe<TOut>>): Fn<Maybe<T>, Maybe<TOut>> => {
  return (input: Maybe<T>) => input.exists
    ? fn(input.value as T) // safe to cast, because of isNothing check
    : Nothing as Maybe<TOut>
}

/** Returns the result of calling a function that returns a Maybe, passing it the value from the supplied Maybe. */
export const chain = <T, TOut>(fn: Fn<T, Maybe<TOut>>) => (maybe: Maybe<T>) => maybe.chain(fn)

/**
 * Passes the value wrapped by the specified Maybe to a function, and returns a Maybe wrapping its result.
 * If the supplied Maybe is None, then None is returned and the function is not called.
 */
export const fmap = <T, TOut>(fn: Fn<T, TOut>) => (maybe: Maybe<T>) => maybe.fmap(fn)

/** Determines if the specified argument is wrapped in a Maybe. */
export const isMaybe = <T>(value: T | Maybe<T> | NoValue): value is Maybe<T> => value instanceof MaybeImpl

/** "Unwraps" a nested Maybe one level. */
export const join = <T>(maybe: Maybe<Maybe<T>>): Maybe<T> => maybe.orElse(Nothing)

/** Returns a Maybe wrapping the given value, or the unchanged argument if it is already a Maybe. */
export const just = <T>(value: T | Maybe<T> | NoValue): Maybe<T> => isMaybe(value) ? value : new MaybeImpl(value)

/** Returns an empty Maybe of the specified type. */
export const none = <T>() => Nothing as Maybe<T>

/** Returns the wrapped value of the specified Maybe, or the supplied default if the Maybe is Nothing. */
export const orElse = <T>(defaultValue: T) => (maybe: Maybe<T>) => maybe.orElse(defaultValue)

/** Returns the specified Maybe if it has a value, or the default if the Maybe is Nothing. */
export const orElseMaybe = <T>(defaultValue: Maybe<T>) => (maybe: Maybe<T>) => maybe.orElseMaybe(defaultValue)
