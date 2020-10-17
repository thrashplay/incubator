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

/**
 * Content block representing a Heading in a document.
 */
export interface Heading extends ContentBlock {
  /** the numeric level of the heading (1-6) */
  level: number

  /** the text contents of this heading */
  text: string
}

export interface Document {
  /** array of sections, in the order they appeared in the source */
  sections: Section[]
}