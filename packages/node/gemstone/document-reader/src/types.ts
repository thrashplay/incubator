import { ValuesType } from 'utility-types'

/**
 * A logical block of Markdown tokens that make up a single section of meaningful content in a document.
 * A content block may combine multiple tokens that, on their own, aren't meaningful (such as open and close
 * tokens around a container of text) and combine them into a higher-order group.
 *
 * Example content blocks could be headings, paragraphs, data tables, etc.
 */
export interface ContentBlock {
  /** gets this block's content as an HTML string */
  getHtml: () => string

  /** gets this block's content as a plain text string */
  getText: () => string
}

/**
 * Content block representing a Heading in a document.
 */
export interface Heading extends ContentBlock {
  /** the numeric level of the heading (1-6) */
  level: number

  /** the text contents of this heading */
  text: string
}

export interface Table extends ContentBlock {
  /** the names of the columns in the table */
  columnNames: string[]

  /**
   * The table's data, represented as an array of Records
   * Each record holds the data for a single table row. The record's keys are the column names, and the
   * values are the string contents of the corresponding cells.
   **/
  data: Record<string, string>[]

  /**
   * The table header's content blocks
   * The value is a record whose keys are the column names, and the values are the ContentBlocks
   * containing the contents of the corresponding header cells.
   **/
  headerContent: Record<string, ContentBlock>

  /**
   * The table body's content blocks, represented as an array of Records
   * Each record holds the content for a single table row. The record's keys are the column names, and the
   * values are the ContentBlocks containing the contents of the corresponding cells.
   **/
  rowContent: Record<string, ContentBlock>[]

  /** the number of rows in the table */
  rows: number
}
export type TableRowContent = ValuesType<Table['rowContent']>
export type TableRowData = ValuesType<Table['data']>

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

  /** collection of tables contained in this section */
  tables: Table[]

  /** the title of this section, which is derived from it's heading */
  title?: string
}

export interface Document {
  /** array of sections, in the order they appeared in the source */
  sections: Section[]
}
