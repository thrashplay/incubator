import { concat, drop, findIndex, isEmpty, size, take } from 'lodash/fp'
import { assign } from 'markdown-it/lib/common/utils'

import { ProcessingContext, Token, TokenProcessorFunction } from './types'
import { getText, tokenOfType } from './utils'

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

const getHeadingTokens = (tokens: Token[]) => take(
  findIndex(tokenOfType('heading_close'))(tokens) + 1,
)(tokens)

// Processes a heading token
// When a heading is encountered, we create a new section and append it to the document
export const parseHeading = (next: TokenProcessorFunction) => (context: ProcessingContext) => {
  const { currentSection, remainingTokens } = context
  
  const headingTokens = getHeadingTokens(remainingTokens)

  if (isEmpty(headingTokens)) {
    next(context)
  } else {
    const heading = {
      level: getHeadingDepth(headingTokens[0]),
      text: getText(headingTokens),
      tokens: headingTokens,
    }

    return next({
      ...context,
      currentSection: assign(currentSection, {
        depth: heading.level,
        heading: heading,
        title: heading?.text,
        tokens: concat(currentSection?.tokens ?? [], headingTokens),
      }),
      remainingTokens: drop(size(headingTokens))(remainingTokens),
    })
  }
}