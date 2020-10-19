import { castArray, concat, contains, drop, head, size } from 'lodash/fp'
import { isString } from 'lodash/fp'
import MarkdownIt from 'markdown-it'
import htmlToText from 'html-to-text'
import { get } from 'lodash'

import { MarkdownSection, Token, TokenProcessingContext } from './types'

const markdown = new MarkdownIt()
const renderer = markdown.renderer

export const addTokens = (tokens: Token[]) => (section: MarkdownSection) =>  ({
  ...section,
  body: {
    ...(section.body ?? []),
    tokens: concat(get(section, 'body.tokens', []), tokens),
  },
  tokens: concat(section.tokens, tokens),
})

export const getText = (input: Token | Token[] | string): string => {
  const html = isString(input)
    ? input
    : renderer.render(castArray(input), {}, {})

  const htmlToTextOptions = {
    uppercaseHeadings: false,
    wordwrap: null,
  }

  return htmlToText.fromString(html, htmlToTextOptions)
}


/** predicate to determine if a token has one of the given types */
export const tokenOneOf = (...types: string[]) => (token: Token | undefined) => contains(token?.type)(types)

/** predicate to determine if a token has a given type */
export const tokenOfType = (type: string) => (token?: Token) => tokenOneOf(type)(token)

/** predicate to determine if a context's next token has one of the given types */
export const nextTokenOneOf = (...types: string[]) => (
  { remainingTokens }: TokenProcessingContext,
) => tokenOneOf(...types)(head(remainingTokens))

/** predicate to determine if a context's next token has the given type */
export const nextTokenOfType = (type: string) => nextTokenOneOf(type)

/**
 * Consumes a set of tokens by removing them from the context's "remainingTokens" array
 */
export const consumeTokens = <
  TContext extends TokenProcessingContext = TokenProcessingContext
>(tokens: Token[]) => (context: TContext): TContext => ({
  ...context,
  remainingTokens: drop(size(tokens))(context.remainingTokens ?? []),
})

export const discardNextToken = <
  TContext extends TokenProcessingContext = TokenProcessingContext
>(context: TContext): TContext => ({
  ...context,
  remainingTokens: drop(1)(context.remainingTokens ?? []),
})

export const getNextTokenType = ({ remainingTokens }: TokenProcessingContext) => head(remainingTokens)?.type ?? ''
