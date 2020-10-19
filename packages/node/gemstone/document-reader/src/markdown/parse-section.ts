import { assign, concat, drop, findIndex, flow, isEmpty, size, take } from 'lodash/fp'

import { Table } from '../types'

import { MarkdownSection, Token, TokenProcessingContext } from './types'
import { consumeTokens, getText, nextTokenOfType, tokenOfType } from './utils'
import { withRenderers } from './render'
import { createTokenProcessor } from './create-token-processor'
import { parseTable } from './parse-table'

export type SectionProcessingContext = TokenProcessingContext<{
  /** section currently being processed */
  currentSection: MarkdownSection
}>


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
const addTokensToSection = (tokens: Token[]) => (section: MarkdownSection) =>  ({
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
const addTokensToCurrentSection = (tokens: Token[]) => (context: TokenProcessingContext) => ({
  ...context,
  currentSection: addTokensToSection(tokens)(context.currentSection),
})

/**
 * Consumes tokens from a context's remaining tokens until one is encountered that has a configured handler.
 * Consumed tokens will be added to the current section via the "addTokensToCurrentSection" method.
 */
const consumeUnhandledTokens = (context: SectionProcessingContext, tokens: Token[]) => {
  return flow(
    consumeTokens(tokens),
    addTokensToCurrentSection(tokens),
  )(context)
}

// Handles a heading token
// When a heading is encountered, we create a new section and append it to the document
// This handler is valid when the next token has a type of 'heading_open'
export const handleHeading = (context: SectionProcessingContext) => {
  const { currentSection, remainingTokens } = context

  const getHeadingTokens = (context: SectionProcessingContext) => {
    const { remainingTokens } = context
  
    return take(
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

const handleTable = (context: SectionProcessingContext) => {
  /**
   * Adds a table to the 'tables' array in the section.
   */
  const addTableToCurrentSection = (table: Table) => (context: SectionProcessingContext) => {
    return {
      ...context,
      currentSection: {
        ...context.currentSection,
        tables: [...(context.currentSection?.tables ?? []), table],
      },
    }
  }

  const { remainingTokens, table } = parseTable(context.currentSection)(context.remainingTokens)
  return flow(
    addTokensToCurrentSection(table.tokens),
    addTableToCurrentSection(table),
    (context: SectionProcessingContext) => ({
      ...context,
      remainingTokens,
    }),
  )(context)
}

/**
 * If we find a heading token (and it isn't the first token we see), consider it the start of 
 * the NEXT section, and complete this one.
 * 
 * his handler is valid when the next token has a type of 'heading_open'
 */
export const markSectionComplete = (context: SectionProcessingContext) => ({
  ...context,
  complete: true,
})

export const isStartOfNewSection = (context: SectionProcessingContext) => 
  nextTokenOfType('heading_open')(context) && !isEmpty(context?.currentSection?.tokens)

export const parseSection = createTokenProcessor({
  handlers: [
    {
      handleTokens: markSectionComplete,
      matches: isStartOfNewSection,
    },
    {
      handleTokens: handleHeading,
      matches: nextTokenOfType('heading_open'),
    },
    {
      handleTokens: handleTable,
      matches: nextTokenOfType('table_open'),
    },
  ],
  unhandledTokenProcessor: consumeUnhandledTokens,
  initialContextFactory: () => ({ 
    currentSection: withRenderers({
      body: withRenderers({ tokens: [] }),
      children: [],
      depth: 1,
      title: undefined,
      tables: [],
      tokens: [],
    }),
  }),
})