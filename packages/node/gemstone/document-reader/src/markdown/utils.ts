import { castArray, contains, drop, head, size } from 'lodash/fp'
import { isString } from 'lodash/fp'
import MarkdownIt from 'markdown-it'
import htmlToText from 'html-to-text'

import { Token, TokenProcessingContext } from './types'

const markdown = new MarkdownIt()
const renderer = markdown.renderer

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

/** predicate to determine if a token has a given type */
export const tokenOfType = (type: string) => (token?: Token) => token?.type === type

/** predicate to determine if a token has one of the given types */
export const tokenOneOf = (...types: string[]) => (token: Token) => contains(token.type)(types)

/** predicate to determine if a context's next token has the given type */
export const nextTokenOfType = (type: string) => (
  { remainingTokens }: TokenProcessingContext
) => tokenOfType(type)(head(remainingTokens))

/**
 * Consumes a set of tokens by removing them from the context's "remainingTokens" array
 */
export const consumeTokens = (tokens: Token[]) => (context: TokenProcessingContext) => ({
  ...context,
  remainingTokens: drop(size(tokens))(context.remainingTokens ?? []),
})

export const getNextTokenType = ({ remainingTokens }: TokenProcessingContext) => head(remainingTokens)?.type ?? ''
