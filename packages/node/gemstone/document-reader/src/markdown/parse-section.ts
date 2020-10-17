import { assign, concat, drop, findIndex, flow, isEmpty, negate, size, take, takeWhile } from 'lodash/fp'

import { MarkdownSection, Token, TokenProcessingContext } from './types'
import { consumeTokens, getNextTokenType, getText, tokenOfType, tokenOneOf } from './utils'
import { withRenderers } from './render'
import { createTokenProcessor } from './create-token-processor'

export type SectionProcessingContext = TokenProcessingContext<{
  /** section currently being processed, or undefined if we are not in a section yet */
  currentSection: MarkdownSection
}>

/**
 * Handler functions for special tokens.
 * When a token type matching a key in this record is found, the specified handler function is called to create
 * a new context state, and optionally consume one or more tokens.
 */
const HANDLED_TOKENS = [
  'heading_open',
  'table_open',
]

const getHeadingDepth = (token: Token) => {
  switch (token.tag) {
    case 'h1':
      return 1
    case 'h2':
      return 2
    case 'h3':
      return 3
    case 'h4':
      return 4
    case 'h5':
      return 5
    case 'h6':
      return 6
    default:
      return 0
  }
}

/**
 * Adds tokens a Markdown section.
 * This method adds the tokens to both the body, and the section's "tokens" list.
 */
export const addTokensToSection = (tokens: Token[]) => (section: MarkdownSection) =>  ({
  ...section,
  body: {
    ...(section.body ?? []),
    tokens: concat(section?.body?.tokens ?? [], tokens),
  },
  tokens: concat(section.tokens, tokens),
})

/**
 * Adds a set of tokens to the context's 'currentSection', using the addTokensToSection method.
 */
export const addTokensToCurrentSection = (tokens: Token[]) => (context: TokenProcessingContext) => ({
  ...context,
  currentSection: addTokensToSection(tokens)(context.currentSection),
})

/**
 * Consumes tokens from a context's remaining tokens until one is encountered that has a configured handler.
 * Consumed tokens will be added to the current section via the "addTokensToCurrentSection" method.
 */
const consumeUnhandledTokens = (handledTokens = HANDLED_TOKENS) => (context: SectionProcessingContext) => {
  const { remainingTokens } = context

  // take all tokens until we encounter one with a handler
  const unhandledTokens = takeWhile(negate(tokenOneOf(...handledTokens)))(remainingTokens)
  return flow(
    consumeTokens(unhandledTokens),
    addTokensToCurrentSection(unhandledTokens),
  )(context)
}

// Processes a heading token
// When a heading is encountered, we create a new section and append it to the document
export const parseHeading = (context: SectionProcessingContext) => {
  const { currentSection, remainingTokens } = context

  const getHeadingTokens = (context: SectionProcessingContext) => {
    const { remainingTokens } = context
  
    return getNextTokenType(context) !== 'heading_open'
      ? []
      : take(
        findIndex(tokenOfType('heading_close'))(remainingTokens) + 1,
      )(remainingTokens)
  }
  
  const headingTokens = getHeadingTokens(context)

  if (isEmpty(headingTokens)) {
    return context
  } else {
    const heading = {
      level: getHeadingDepth(headingTokens[0]),
      text: getText(headingTokens),
      tokens: headingTokens,
    }

    return {
      ...context,
      currentSection: assign(currentSection, {
        depth: heading.level,
        heading: heading,
        title: heading?.text,
        tokens: concat(currentSection?.tokens ?? [], headingTokens),
      }),
      remainingTokens: drop(size(headingTokens))(remainingTokens),
    }
  }
}

export const parseBody = (context: SectionProcessingContext) => {
  return context.complete
    ? context
    : flow(
      consumeUnhandledTokens(HANDLED_TOKENS),
      // parseTable,
    )(context)
}

export const completeSectionIfHeadingFound = (context: SectionProcessingContext) => ({
  ...context,
  complete: getNextTokenType(context) === 'heading_open',
})

const createSection = () => withRenderers({
  body: withRenderers({ tokens: [] }),
  children: [],
  depth: 1,
  title: undefined,
  tables: [],
  tokens: [],
})

export const parseSection = createTokenProcessor(
  [
    parseHeading,
    parseBody,
    completeSectionIfHeadingFound,
  ],
  () => ({ currentSection: createSection() }),
)