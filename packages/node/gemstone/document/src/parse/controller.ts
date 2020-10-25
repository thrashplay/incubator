import { castArray,
  flow,
  get, 
  map, 
  reduce,
  takeRight, 
} from 'lodash/fp'

import { DocumentNode } from '../types'

import * as Actions from './actions'
import { DocumentContext, NodeContext } from './context'
import { ParsingAction, reducer } from './reducer'

const dispatch = (action: ParsingAction | ParsingAction[]) => (context: DocumentContext): DocumentContext => {
  const callback = (previous: DocumentContext, action: ParsingAction) => reducer(previous, action)
  return reduce(callback)(context, castArray(action))
}

const processCompleted = (nodeList: DocumentNode[]) => (context: DocumentContext): DocumentContext => {
  const callback = (previous: DocumentContext, node: DocumentNode) => dispatch(Actions.processNode(node))(previous)
  return reduce(callback)(context, nodeList)
}

export const endNode = (context: DocumentContext) => {
  const addContent = <TNode extends DocumentNode>(nodeWithoutContent: NodeContext<TNode>) => ({
    ...nodeWithoutContent,
    content: {
      getText: () => '',
    },
  })

  const completed: DocumentNode[] = flow(
    get('nodesInProgress'),
    takeRight(1),
    map(addContent),
  )(context)

  return flow(
    dispatch(Actions.endNode()),
    processCompleted(completed),
  )(context)
}

TODO: implement other controller functions and write the parser