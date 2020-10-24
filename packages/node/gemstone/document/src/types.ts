import { ValuesType } from 'utility-types'

/**
 * A logical block content that make up a single portion of a document.
 * Example content blocks could be headings, paragraphs, data tables, etc.
 */
export interface Content {
  /** returns the content as plain text */
  getText: () => string
}

/** Node structure for documents */
export type DocumentNodeType = 
  'generic' | 
  'heading' | 
  'section' | 
  'root' |
  'table' |
  'table-body' |
  'table-footer' |
  'table-header'

export interface BaseDocumentNode {
  children: DocumentNode[]
  content: Content
}

export interface HeadingNode extends BaseDocumentNode {
  /** the numeric level of the heading (i.e. 1-6) */
  level: number

  type: 'heading'
}

export interface TableNode extends BaseDocumentNode { 
  /** the table's body, if it has one */
  body?: DocumentNode

  /** the names of the columns in the table */
  columnNames: string[]

  /** 
   * The table's data, represented as an array of Records 
   * Each record holds the data for a single table row. The record's keys are the column names, and the
   * values are the string contents of the corresponding cells.
   **/
  data: Record<string, string>[]

  /** the table's footer, if it has one */
  footer?: DocumentNode

  /** the table's body, if it has one */
  header?: DocumentNode

  /** number of rows in this table */
  rowCount: number

  type: 'table'
}
export type TableRowData = ValuesType<TableNode['data']>

export interface SectionNode extends BaseDocumentNode {
  /** the heading block for this section */
  heading?: HeadingNode

  /**
   * The depth of this section.
   * The document root is depth '0', and each level of nesting for sections increases this value by 1
   */
  level: number
  
  /** collection of table nodes contained in this section */
  tables: TableNode[]

  /** the title of this section, which is derived from it's heading */
  title?: string

  type: 'section'
}

type SpecialNodes = HeadingNode | SectionNode | TableNode

export type DocumentNode = SpecialNodes |
(
  BaseDocumentNode & 
  {
    type: Omit<DocumentNodeType, SpecialNodes['type']>
  }
)

export interface Document {
  /** the document's root node */
  root: DocumentNode
}