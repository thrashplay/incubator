import { get, head } from 'lodash/fp'

import { endNode, processSectionNode, processTableBodyNode, processTableFooterNode, processTableHeaderNode, processTableNode, startDocument, startNode } from './actions'
import { DocumentContext } from './context'
import { generic, node, reducer, root, section, table, tableBody, tableFooter, tableHeader } from './reducer'

const EMPTY_CONTENT = {
  getText: () => '',
}

const withContent = <T>(partialNode: T) => ({
  ...partialNode,
  content: EMPTY_CONTENT,
})

describe('default reducer', () => {
  // describe.skip('startDocument', () => {
  //   it('does nothing if document already started', () => {
  //     const result = reducer(defaultContext, startDocument())
  //     const secondResult = reducer(result, startDocument())
  //     expect(secondResult).toBe(result)
  //   })
  
  //   it('appends root node to "nodesInProgress"', () => {
  //     const result = reducer(defaultContext, startDocument())
  //     expect(result.nodesInProgress).toHaveLength(1)
  //     expect(result.nodesInProgress[0].type).toBe('root')
  //   })
  // })

  describe('startNode', () => {
    const defaultContext: DocumentContext = {
      nodesInProgress: [node('root', {})],
    }
    
    describe('generic', () => {
      const result = reducer(defaultContext, startNode('generic'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('generic')
      })
    })

    describe('heading', () => {
      const result = reducer(defaultContext, startNode('heading'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('heading')
      })

      it('adds node with correct default level', () => {
        expect(get('level')(result.nodesInProgress[1])).toBe(0)
      })
    })

    describe('root', () => {
      const result = reducer(defaultContext, startNode('root'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('root')
      })
    })

    describe('section', () => {
      const result = reducer(defaultContext, startNode('section'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('section')
      })

      it('adds node with correct default level', () => {
        expect(get('level')(result.nodesInProgress[1])).toBe(0)
      })

      it('adds node with correct default tables', () => {
        expect(get('tables')(result.nodesInProgress[1])).toStrictEqual([])
      })
    })

    describe('table', () => {
      const result = reducer(defaultContext, startNode('table'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('table')
      })

      it('adds node with correct default column names', () => {
        expect(get('columnNames')(result.nodesInProgress[1])).toStrictEqual([])
      })
      
      it('adds node with correct default data', () => {
        expect(get('data')(result.nodesInProgress[1])).toStrictEqual([])
      })

      it('adds node with correct default row count', () => {
        expect(get('rowCount')(result.nodesInProgress[1])).toBe(0)
      })

    })

    describe('table-body', () => {
      const result = reducer(defaultContext, startNode('table-body'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('table-body')
      })
    })

    describe('table-footer', () => {
      const result = reducer(defaultContext, startNode('table-footer'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('table-footer')
      })
    })

    describe('table-header', () => {
      const result = reducer(defaultContext, startNode('table-header'))

      it('adds new node', () => {
        expect(result.nodesInProgress).toHaveLength(2)
        expect(result.nodesInProgress[1].type).toBe('table-header')
      })
    })
  })

  describe('endNode', () => {
    const defaultContext: DocumentContext = {
      nodesInProgress: [
        node('root', {}),
        node('generic', {}),
      ],
    }

    it('removes last node in progress', () => {
      const firstResult = reducer(defaultContext, endNode())
      expect(firstResult.nodesInProgress).toHaveLength(1)
      expect(firstResult.nodesInProgress[0].type).toBe('root')
 
      const secondResult = reducer(firstResult, endNode())
      expect(secondResult.nodesInProgress).toHaveLength(0)
    })

    it('does nothing if no nodes in progress', () => {
      const emptyContext = { nodesInProgress: [] }
      expect(reducer(emptyContext, endNode())).toBe(emptyContext)
    })
  })

  describe('processSectionNode', () => {
    const finishedSection = withContent(section())

    it('does NOT add section to non-closest ancesor section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          section(),
        ],
      }

      const result = reducer(context, processSectionNode(finishedSection))
      expect(get('tables')(result.nodesInProgress[1])).toHaveLength(0)
    })

    it('adds section to immediately containing section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          section(),
        ],
      }

      const result = reducer(context, processSectionNode(finishedSection))
      expect(result.nodesInProgress[2].children).toHaveLength(1)
      expect(result.nodesInProgress[2].children[0]).toBe(finishedSection)
    })

    it('adds section to distant ancestor section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          generic(),
          generic(),
        ],
      }

      const result = reducer(context, processSectionNode(finishedSection))
      expect(result.nodesInProgress[1].children).toHaveLength(1)
      expect(result.nodesInProgress[1].children[0]).toBe(finishedSection)
    })

    it('does nothing if no ancestor section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
        ],
      }

      const result = reducer(context, processSectionNode(finishedSection))
      expect(result).toBe(context)
    })
  })

  describe('processTableNode', () => {
    const finishedTable = withContent(table())

    it('does NOT add table to non-closest ancestor section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          section(),
        ],
      }

      const result = reducer(context, processTableNode(finishedTable))
      expect(get('tables')(result.nodesInProgress[1])).toHaveLength(0)
    })

    it('adds table to immediately containing section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          section(),
        ],
      }

      const result = reducer(context, processTableNode(finishedTable))
      expect(get('tables')(result.nodesInProgress[2])).toHaveLength(1)
      expect(head(get('tables')(result.nodesInProgress[2]))).toBe(finishedTable)
    })

    it('adds table to distant ancestor section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          generic(),
          generic(),
        ],
      }

      const result = reducer(context, processTableNode(finishedTable))
      expect(get('tables')(result.nodesInProgress[1])).toHaveLength(1)
      expect(head(get('tables')(result.nodesInProgress[1]))).toBe(finishedTable)
    })

    it('does nothing if no ancestor section', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
        ],
      }

      const result = reducer(context, processTableNode(finishedTable))
      expect(result).toBe(context)
    })
  })

  describe('processTableHeaderNode', () => {
    const finishedTableHeader = withContent(tableHeader())

    it('does NOT add table header to non-closest table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
          table(),
        ],
      }

      const result = reducer(context, processTableHeaderNode(finishedTableHeader))
      expect(get('header')(result.nodesInProgress[2])).toBeUndefined()
    })

    it('adds table header to immediately containing table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
        ],
      }

      const result = reducer(context, processTableHeaderNode(finishedTableHeader))
      expect(get('header')(result.nodesInProgress[2])).toBe(finishedTableHeader)
    })

    it('adds table header to distant ancestor table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
          generic(),
          generic(),
        ],
      }

      const result = reducer(context, processTableHeaderNode(finishedTableHeader))
      expect(get('header')(result.nodesInProgress[2])).toBe(finishedTableHeader)
    })

    it('does nothing if no ancestor table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
        ],
      }

      const result = reducer(context, processTableHeaderNode(finishedTableHeader))
      expect(result).toBe(context)
    })
  })

  describe('processTableBodyNode', () => {
    const finishedTableBody = withContent(tableBody())

    it('does NOT add table body to non-closest table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
          table(),
        ],
      }

      const result = reducer(context, processTableBodyNode(finishedTableBody))
      expect(get('body')(result.nodesInProgress[2])).toBeUndefined()
    })

    it('adds table body to immediately containing table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
        ],
      }

      const result = reducer(context, processTableBodyNode(finishedTableBody))
      expect(get('body')(result.nodesInProgress[2])).toBe(finishedTableBody)
    })

    it('adds table body to distant ancestor table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
          generic(),
          generic(),
        ],
      }

      const result = reducer(context, processTableBodyNode(finishedTableBody))
      expect(get('body')(result.nodesInProgress[2])).toBe(finishedTableBody)
    })

    it('does nothing if no ancestor table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
        ],
      }

      const result = reducer(context, processTableBodyNode(finishedTableBody))
      expect(result).toBe(context)
    })
  })

  describe('processTableFooterNode', () => {
    const finishedTableFooter = withContent(tableFooter())

    it('does NOT add table footer to non-closest table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
          table(),
        ],
      }

      const result = reducer(context, processTableFooterNode(finishedTableFooter))
      expect(get('footer')(result.nodesInProgress[2])).toBeUndefined()
    })

    it('adds table footer to immediately containing table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
        ],
      }

      const result = reducer(context, processTableFooterNode(finishedTableFooter))
      expect(get('footer')(result.nodesInProgress[2])).toBe(finishedTableFooter)
    })

    it('adds table footer to distant ancestor table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
          section(),
          table(),
          generic(),
          generic(),
        ],
      }

      const result = reducer(context, processTableFooterNode(finishedTableFooter))
      expect(get('footer')(result.nodesInProgress[2])).toBe(finishedTableFooter)
    })

    it('does nothing if no ancestor table', () => {
      const context: DocumentContext = {
        nodesInProgress: [
          root(),
        ],
      }

      const result = reducer(context, processTableFooterNode(finishedTableFooter))
      expect(result).toBe(context)
    })
  })
})