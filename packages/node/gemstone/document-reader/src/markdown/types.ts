import MarkdownIt from 'markdown-it'
import { ContentBlock, Section } from '../types'

export type Token = ReturnType<ReturnType<typeof MarkdownIt>['parse']>[number]

export interface ProcessingContext {
  /** section currently being processed, or undefined if we are not in a section yet */
  currentSection: MarkdownSection

  remainingTokens: Token[]

  /** sections that have already been successfully parsed */
  sections: MarkdownSection[]
}

export type TokenProcessorFunction = (context: ProcessingContext) => void

/**
 * A logical block of Markdown tokens that make up a single section of meaningful content in a document.
 * A content block may combine multiple tokens that, on their own, aren't meaningful (such as open and close
 * tokens around a container of text) and combine them into a higher-order group.
 * 
 * Example content blocks could be headings, paragraphs, data tables, etc.
 */
export interface MarkdownContentBlock extends ContentBlock {
  /** Markdown tokens comprising this block */
  tokens: Token[]
}

export interface MarkdownSection extends Section, MarkdownContentBlock {
  body: MarkdownContentBlock
}
