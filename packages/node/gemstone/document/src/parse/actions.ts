import { createAction } from 'typesafe-actions'

import { DocumentNode, DocumentNodeType, HeadingNode, SectionNode, TableNode } from '../types'

export const startDocument = createAction('document/start')()
export const endDocument = createAction('document/end')()

// creates the node and adds it to the 'in-progress' stack
export const startNode = createAction('node/start')<DocumentNodeType>()
// removes the node from the 'in-progess' stack
export const endNode = createAction('node/end')()

// The following actions are dispatched when a node of the specified type is completed, 
// after the corresponding 'endNode' action has been dispatched

// does nothing by default
export const processGenericNode = createAction('node/process-generic')<DocumentNode>()
// does nothing by default
export const processHeadingNode = createAction('node/process-heading')<HeadingNode>()
// does nothing by default
export const processRootNode = createAction('node/process-root')<DocumentNode>()
// adds the new section to its parent
export const processSectionNode = createAction('node/process-section')<SectionNode>()
// adds the new table to its containing section
export const processTableNode = createAction('node/process-table')<TableNode>()
// adds the table body to the containing table
export const processTableBodyNode = createAction('node/process-table-body')<DocumentNode>()
// adds the table footer to the containing footer
export const processTableFooterNode = createAction('node/process-table-row')<DocumentNode>()
// adds the table header to the containing footer
export const processTableHeaderNode = createAction('node/process-table-header')<DocumentNode>()

// helper action creator that creates one of the above 'process*Node' actions
export const processNode = (node: DocumentNode) => {
  switch (node.type) {
    case 'generic':
      return processGenericNode(node)

    TODO: implement other processors

    default:
      return processGenericNode(node)
  }
}