import { flow, isEmpty } from 'lodash'
import { castArray, find, head } from 'lodash/fp'
import { Optional } from 'utility-types'

import { Token, TokenProcessingContext, TokenProcessingContextSharedFields } from './types'
import { consumeTokens } from './utils'

export type TokenHandlerFunction<TContext extends TokenProcessingContext = TokenProcessingContext> =
  (context: TContext) => TContext

/**
 * Function that is used to process batches of unhandled tokens encountered in a document.
 * Whenever a string of tokens with no configured handler is found, those tokens will be batched
 * and passed to this function. The return value is the new context state, after processing these
 * tokens.
 */
export type UnhandledTokenProcessor<TContext extends TokenProcessingContext = TokenProcessingContext> =
  (context: TContext, tokens: Token[]) => TContext

/**
 * UnhandledTokenProcessor that simple discards the tokens by removing them from the context.
 */
export const DISCARD = <TContext extends TokenProcessingContext = TokenProcessingContext>(
  context: TContext,
  tokens: Token[] | Token,
) => consumeTokens(castArray(tokens))(context)

/**
 * Handler that is able to handle a token stream, and update it's corresponding processing context.
 * If the 'matches' method returns true for a given context, then this token handler is able to handle
 * the token currently at the front of the token stream. The 'handleTokens' function performs this
 * handling, returning the new context after handling is complete (which may or not involve modifying
 * the context's remaining tokens). 
 */
export interface TokenHandler<TContext extends TokenProcessingContext = TokenProcessingContext> {
  matches: (context: TContext) => boolean
  handleTokens: TokenHandlerFunction<TContext>
}

export interface TokenProcessorOptions<
  TContextState extends any = any,
  TContext extends TokenProcessingContext = TokenProcessingContext<TContextState>,
> {
  handlers?: TokenHandler<TContext>[]
  initialContextFactory: (tokens: Token[]) => Optional<TContext, keyof TokenProcessingContextSharedFields>
  unhandledTokenProcessor?: UnhandledTokenProcessor<TContext>
}

export const createTokenProcessor = <
  TContextState extends any = any,
  TContext extends TokenProcessingContext = TokenProcessingContext<TContextState>,
>({
  handlers = [],
  initialContextFactory,
  unhandledTokenProcessor = DISCARD,
}: TokenProcessorOptions<TContextState, TContext>) => (tokens: Token[]): TContext => {
  // TODO: for performance we should batch the unrecognized tokens instead of processing them individually
  // also, given the recursion, this might kill us......
  const handleUnrecognizedTokens = (context: TContext): TContext => {
    const nextToken = head(context.remainingTokens)
    return nextToken === undefined ? context : unhandledTokenProcessor(context, castArray(nextToken))
  }

  const getHandlerFunction = (context: TContext) => find(
    (handler: TokenHandler<TContext>) => handler.matches(context),
  )(handlers)?.handleTokens ?? handleUnrecognizedTokens
     
  const processRecursively = (context: TContext): TContext => {
    return (context.complete || isEmpty(context.remainingTokens))
      ? context
      : flow(
        getHandlerFunction(context),
        processRecursively,
      )(context)
  }

  return processRecursively(
    {
      complete: false,
      remainingTokens: tokens,
      ...initialContextFactory(tokens),
    } as TContext,
  )
}
