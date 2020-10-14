import { isEmpty } from 'lodash'
import MarkdownIt from 'markdown-it'

import { ProcessingContext, Section, Token } from './types'
import { parseSection } from './blocks/section'

export type Document = Section[]

const parseTokens = (tokens: Token[], callback: (document: Section[]) => void) => {
  const handleNext = (context: ProcessingContext) => {
    const { remainingTokens, sections } = context

    if (isEmpty(remainingTokens)) {
      callback(context.sections)
    } else {
      parseSection(remainingTokens, sections, handleNext)
    }
  }

  if (isEmpty(tokens)) {
    callback([])
  } else {
    parseSection(tokens, [], handleNext)
  }
}

export const parse = (content: string): Promise<Document> => {
  return new Promise<Document>((resolve) => {
    const markdown = new MarkdownIt()
    const tokens = markdown.parse(content, {})

    parseTokens(tokens, resolve)
  })
}
