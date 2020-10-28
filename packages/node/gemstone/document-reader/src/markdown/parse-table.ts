import { isEmpty, reduce } from 'lodash'
import { concat, findIndex, flow, map, take } from 'lodash/fp'

import { ContentBlock, TableRowContent, TableRowData } from '../types'

import { createTokenProcessor } from './create-token-processor'
import { withRenderers } from './render'
import { MarkdownContentBlock, MarkdownSection, MarkdownTable, Token, TokenProcessingContext } from './types'
import { consumeTokens, discardNextToken, nextTokenOfType, nextTokenOneOf, tokenOneOf } from './utils'

interface RowProgress {
  cells: MarkdownContentBlock[]
}

export type TableSection = 'Body' | 'Footer' | 'Header'
export type TableProcessingContext = TokenProcessingContext<{
  /** current row, or undefined if one has not been started */
  currentRow: RowProgress | undefined

  /** section currently being processed */
  section: MarkdownSection
  table: MarkdownTable

  /** current table section being processed */
  tableSection: TableSection
}>

const handleTableClose = (context: TableProcessingContext) => {
  return {
    // consume the table_close token
    ...consumeUnhandledTokens(context, take(1)(context.remainingTokens)),
    complete: true,
  }
}

const addRowContent = (context: TableProcessingContext) => {
  const reducer = (result: TableRowContent, cell: MarkdownContentBlock, index: number) => {
    const columnKey = context.table?.columnNames[index] ?? index.toString()
    return {
      ...result,
      [columnKey]: cell,
    }
  }

  const rowContent = reduce(
    context.currentRow?.cells ?? [],
    reducer,
    {}
  )

  return {
    ...context,
    table: {
      ...context.table,
      rowContent: concat(context.table.rowContent, rowContent),
    },
  }
}

const addRowData = (context: TableProcessingContext) => {
  const reducer = (result: TableRowData, cell: MarkdownContentBlock, index: number) => {
    const columnKey = context.table?.columnNames[index] ?? index.toString()
    return {
      ...result,
      [columnKey]: cell.getText(),
    }
  }

  const rowData = reduce(
    context.currentRow?.cells ?? [],
    reducer,
    {}
  )

  return {
    ...context,
    table: {
      ...context.table,
      data: concat(context.table.data, rowData),
    },
  }
}

const completeBodyRow = (context: TableProcessingContext) => {
  const finishRow = (context: TableProcessingContext) => ({
    ...context,
    currentRow: undefined,
    table: {
      ...context.table,
      rows: context.table.rows + 1,
    },
  })

  return flow(
    addRowContent,
    addRowData,
    finishRow
  )(context)
}

const completeFooterRow = (context: TableProcessingContext) => {
  return {
    ...context,
    currentRow: undefined,
  }
}

const completeHeaderRow = (context: TableProcessingContext) => {
  return {
    ...context,
    currentRow: undefined,
    table: {
      ...context.table,
      columnNames: map((cell: ContentBlock) => cell.getText())(context.currentRow?.cells ?? []),
    },
  }
}

const completeCurrentRow = (context: TableProcessingContext) => {
  const completeRow = (context: TableProcessingContext) => {
    switch (context.tableSection) {
      case 'Footer':
        return completeFooterRow(context)
      case 'Header':
        return completeHeaderRow(context)
      default:
        return completeBodyRow(context)
    }
  }

  return context.currentRow === undefined
    ? context
    : completeRow(context)
}

const handleRowStart = (context: TableProcessingContext) => {
  const createNewRow = (context: TableProcessingContext) => ({
    ...context,
    currentRow: {
      cells: [],
    },
  })

  return flow(
    completeCurrentRow,
    createNewRow,
    consumeNextToken
  )(context)
}

const handleRowEnd = (context: TableProcessingContext) => {
  return flow(
    completeCurrentRow,
    consumeNextToken
  )(context)
}

const handleCell = (context: TableProcessingContext) => {
  const getCellTokens = (context: TableProcessingContext) => {
    const { remainingTokens } = context

    return take(
      findIndex(tokenOneOf('td_close', 'th_close'))(remainingTokens) + 1
    )(remainingTokens)
  }

  const cellTokens = getCellTokens(context)

  const addCell = (cellTokens: Token[]) => (context: TableProcessingContext) => {
    if (isEmpty(cellTokens)) {
      return context
    } else {
      const cellBlock = withRenderers({
        tokens: cellTokens,
      })

      return {
        ...context,
        currentRow: {
          cells: [
            ...(context.currentRow?.cells ?? []),
            cellBlock,
          ],
        },
      }
    }
  }

  return flow(
    addCell(cellTokens),
    addTokensToTable(cellTokens),
    consumeTokens(cellTokens)
  )(context)
}

/** updates the context by setting the table section to the specified value, consuming the current token */
const setTableSection = (tableSection: TableSection) => flow(
  (context: TableProcessingContext) => ({
    ...context,
    tableSection,
  }),
  consumeNextToken
)

/**
 * Adds a set of tokens to the context's 'table'.
 */
const addTokensToTable = (tokens: Token[]) => (context: TableProcessingContext) => ({
  ...context,
  table: {
    ...context.table,
    tokens: concat(context.table?.tokens, tokens),
  },
})

export const consumeNextToken = (context: TableProcessingContext) => flow(
  addTokensToTable(take(1)(context.remainingTokens)),
  discardNextToken
)(context)

/**
 * Consumes tokens from a context's remaining tokens until one is encountered that has a configured handler.
 * Consumed tokens will be added to the table's content block
 */
const consumeUnhandledTokens = (context: TableProcessingContext, tokens: Token[]) => {
  return flow(
    consumeTokens(tokens),
    addTokensToTable(tokens)
  )(context)
}

// todo: generalize the 'TOKEN_HANDLERS' patterns with consuming unrecognized/handling recognized tokens,
// and reuse in section and document
export const parseTable = (section: MarkdownSection) => createTokenProcessor({
  handlers: [
    {
      handleTokens: handleTableClose,
      matches: nextTokenOfType('table_close'),
    },
    {
      handleTokens: setTableSection('Header'),
      matches: nextTokenOfType('thead_open'),
    },
    {
      handleTokens: setTableSection('Body'),
      matches: nextTokenOfType('thead_close'),
    },
    {
      handleTokens: setTableSection('Footer'),
      matches: nextTokenOfType('tfoot_open'),
    },
    {
      handleTokens: setTableSection('Body'),
      matches: nextTokenOfType('tfoot_close'),
    },
    {
      handleTokens: handleRowStart,
      matches: nextTokenOfType('tr_open'),
    },
    {
      handleTokens: handleRowEnd,
      matches: nextTokenOfType('tr_close'),
    },
    {
      handleTokens: handleCell,
      matches: nextTokenOneOf('td_open', 'th_open'),
    },
  ],
  unhandledTokenProcessor: consumeUnhandledTokens,
  initialContextFactory: () => ({
    currentRow: undefined,
    section,
    table: withRenderers({
      columnNames: [],
      data: [],
      headerContent: {},
      rowContent: [],
      rows: 0,
      tokens: [],
    }),
    tableSection: 'Body',
  } as const),
})
