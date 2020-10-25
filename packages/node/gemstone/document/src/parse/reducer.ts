import { ActionType } from 'typesafe-actions'
import produce from 'immer'
import { getType } from 'typesafe-actions'
import { filter, flow, forEach, get, takeRight } from 'lodash/fp'
import { matches } from 'lodash/fp'

import { BaseDocumentNode, DocumentNode, DocumentNodeType, SectionNode, TableNode } from '../types'

import { DocumentContext, NodeContext } from './context'
import * as Actions from './actions'

export type ParsingAction = ActionType<typeof Actions>

const defaultProps = {
  heading: { 
    level: 0,
  }, 
  section: {
    level: 0,
    tables: [],
  },
  table: {
    columnNames: [],
    data: [],
    rowCount: 0,
  },
}

export const node = <TType extends DocumentNodeType, TProps extends {}>(
  type: TType, 
  extraProps: TProps,
  children: DocumentNode[] = [], 
): Omit<BaseDocumentNode, 'content'> & { type: TType } & TProps => ({
  ...extraProps,
  children,
  type,
})

export const generic = () => node('generic', {})
export const root = () => node('root', {})
export const section = () => node('section', defaultProps.section)
export const table = () => node('table', defaultProps.table)
export const tableHeader = () => node('table-header', {})
export const tableBody = () => node('table-body', {})
export const tableFooter = () => node('table-body', {})

const updateClosestNodeMatching = <TNode extends DocumentNode>(predicate: (node: NodeContext<TNode>) => boolean) => (
  updater: (node: NodeContext<TNode>) => void,
) => (context: DocumentContext) => flow(
  get('nodesInProgress'),
  filter(predicate),
  takeRight(1),
  forEach(updater),
)(context)

const updateClosestSection = (updater: (section: NodeContext<SectionNode>) => void) =>
  updateClosestNodeMatching<SectionNode>(matches({ type: 'section' }))(updater)

const updateClosestTable = (updater: (table: NodeContext<TableNode>) => void) => 
  updateClosestNodeMatching<TableNode>(matches({ type: 'table' }))(updater)

export const reducer = (immutableContext: DocumentContext, action: ParsingAction) => produce(immutableContext, (context: DocumentContext) => {
  switch (action.type) {
    case getType(Actions.endNode):
      context.nodesInProgress.pop()
      break

    case getType(Actions.startNode):
      const nodeType = action.payload
      context.nodesInProgress.push(node(nodeType, get(nodeType)(defaultProps) ?? {}))
      break

      // default node processing

    case getType(Actions.processSectionNode):
      updateClosestSection((node: NodeContext<SectionNode>) => { node.children.push(action.payload) })(context)
      break

    case getType(Actions.processTableNode):
      updateClosestSection((node: NodeContext<SectionNode>) => { node.tables.push(action.payload) })(context)
      break

    case getType(Actions.processTableHeaderNode):
      updateClosestTable((node: NodeContext<TableNode>) => { node.header = action.payload })(context)
      break

    case getType(Actions.processTableBodyNode):
      updateClosestTable((node: NodeContext<TableNode>) => { node.body = action.payload })(context)
      break

    case getType(Actions.processTableFooterNode):
      updateClosestTable((node: NodeContext<TableNode>) => { node.footer = action.payload })(context)
      break
  }
})