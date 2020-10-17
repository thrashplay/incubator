import { flow, isEmpty } from 'lodash'
import { Optional } from 'utility-types'

import { Token, TokenProcessingContext, TokenProcessingContextSharedFields, TokenStreamHandler } from './types'

export const createTokenProcessor = <
  TContextState extends any = any,
  TContext extends TokenProcessingContext = TokenProcessingContext<TContextState>,
>(
  handlers: TokenStreamHandler<TContextState>[],
  createContext: (tokens: Token[]) => Optional<TContext, keyof TokenProcessingContextSharedFields>,
) => (tokens: Token[]): TContext => {
  const processRecursively = (context: TContext): TContext => {
    return (context.complete || isEmpty(context.remainingTokens))
      ? context
      : flow(
        ...handlers,
        processRecursively,
      )(context)
  }

  return processRecursively(
    {
      complete: false,
      remainingTokens: tokens,
      ...createContext(tokens),
    } as TContext,
  )
}
