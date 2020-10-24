import { Document, DocumentNode, SectionNode } from '../types'

/** root of all queries against a document: either the document itself, or a node inside it */
export type QueryRoot = Document | DocumentNode

export type SectionQueryRoot = Document | SectionNode
