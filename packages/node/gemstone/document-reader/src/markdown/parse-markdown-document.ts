import { findLastIndex, flow, stubTrue } from 'lodash/fp'
import MarkdownIt from 'markdown-it'

import { mapAt } from '@thrashplay/fp'

import { Document } from '../types'

import { createTokenProcessor } from './create-token-processor'
import { parseSection } from './parse-section'
import { MarkdownSection, TokenProcessingContext } from './types'

type DocumentProcessingContext = TokenProcessingContext<{
  /** sections that have already been successfully parsed */
  sections: MarkdownSection[]
}>

const parseNextSection = (context: DocumentProcessingContext) => {
  /**
   * Adds a section as a child to the most recently parsed section with a depth that is lower (that is, a higher
   * level section in the document hierarchy). Does not modify any sections if there is no higher-level section.
   */
  const addSectionToParent = (section: MarkdownSection) => (context: DocumentProcessingContext) => {
    const depthLessThan = (section: MarkdownSection) => (item: MarkdownSection) => item.depth < section.depth
    const addChild = (child: MarkdownSection) => (parent: MarkdownSection) => ({
      ...parent,
      children: [...parent.children, child],
    })

    const { sections } = context
    const parentIndex = findLastIndex(depthLessThan(section))(sections)
    return parentIndex === -1 ? context : {
      ...context,
      sections: mapAt(parentIndex, addChild(section))(sections),
    }
  }

  /**
   * Adds a section to the 'sections' array in the document.
   */
  const addSectionToDocument = (section: MarkdownSection) => (context: DocumentProcessingContext) => {
    return {
      ...context,
      sections: [...(context.sections ?? []), section],
    }
  }

  const { currentSection, remainingTokens } = parseSection(context.remainingTokens)
  return flow(
    addSectionToParent(currentSection),
    addSectionToDocument(currentSection),
    (context: DocumentProcessingContext) => ({
      ...context,
      remainingTokens,
    })
  )(context)
}

const parseDocument = createTokenProcessor({
  handlers: [
    {
      matches: stubTrue,
      handleTokens: parseNextSection,
    },
  ],
  initialContextFactory: () => ({ sections: [] }),
})

export const parseMarkdownDocument = (content: string): Promise<Document> => {
  return new Promise<Document>((resolve: (document: Document) => void) => {
    const markdown = new MarkdownIt()
    const tokens = markdown.parse(content, {})

    resolve(parseDocument(tokens))
  })
}
