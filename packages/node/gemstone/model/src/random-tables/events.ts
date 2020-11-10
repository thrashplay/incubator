import { ActionType, createAction } from 'typesafe-actions'

import { RandomTable } from './state'

export const RandomTablesEvents = {
  tableCreated: createAction('random-table/created')<RandomTable>(),
}

export type RandomTablesEvent = ActionType<typeof RandomTablesEvents>
