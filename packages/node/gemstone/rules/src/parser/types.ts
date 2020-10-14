import MarkdownIt from 'markdown-it'

import { Heading } from './blocks/heading'

export type Token = ReturnType<ReturnType<typeof MarkdownIt>['parse']>[number]

export interface ProcessingContext {
  /** section currently being processed, or undefined if we are not in a section yet */
  currentSection: Section

  remainingTokens: Token[]

  /** sections that have already been successfully parsed */
  sections: Section[]
}

export type TokenProcessorFunction = (context: ProcessingContext) => void

/**
 * A logical block of Markdown tokens that make up a single section of meaningful content in a document.
 * A content block may combine multiple tokens that, on their own, aren't meaningful (such as open and close
 * tokens around a container of text) and combine them into a higher-order group.
 * 
 * Example content blocks could be headings, paragraphs, data tables, etc.
 */
export interface ContentBlock {
  /** Markdown tokens comprising this block */
  tokens: Token[]
}

/**
 * Content block representing a section in a document.
 * A section consists of a heading and body content. Sections can be nested inside each other to form a
 * hierarchical document structure.
 */
export interface Section extends ContentBlock {
  /** 
   * Block representing all of the section's body content, including sub-sections. 
   * The section heading is not included.
   **/
  body: ContentBlock

  /** child sections of this section */
  children: Section[]

  /**
   * The depth of this section.
   * The document root is depth '0', and each level of nesting for sections increases this value by 1
   */
  depth: number

  /** the heading block for this section */
  heading?: Heading

  /** the title of this section, which is derived from it's heading */
  title?: string
}
