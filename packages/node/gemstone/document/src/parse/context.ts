import { DocumentNode } from '../types'

/**
 * Parsing context for a single node.
 */
export type NodeContext<TNode extends DocumentNode = DocumentNode> = Omit<TNode, 'content'>

/**
 * Parsing context for an entire node.
 */
export interface DocumentContext {
  /** all nodes that have been started, but not yet finished */
  nodesInProgress: NodeContext[]
}