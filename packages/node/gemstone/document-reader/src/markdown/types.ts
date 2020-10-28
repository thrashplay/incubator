import MarkdownIt from 'markdown-it'

import { ContentBlock, Section, Table } from '../types'

export type Token = ReturnType<ReturnType<typeof MarkdownIt>['parse']>[number]

export type TokenProcessingContextSharedFields = {
  complete: boolean
  remainingTokens: Token[]
}

export type TokenProcessingContext<TState extends any = any> =
  TokenProcessingContextSharedFields &
  {
    [k in keyof TState]: TState[k]
  }

export type TokenStreamHandler<TContext extends TokenProcessingContext = TokenProcessingContext> =
  (context: TContext) => TContext

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

export type MarkdownTable = Table & MarkdownContentBlock
