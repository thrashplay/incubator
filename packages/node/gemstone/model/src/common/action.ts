import { ActionType, createAction } from 'typesafe-actions'

export const CommonActions = {
  initialized: createAction('common/initialized')(),
}

export type CommonAction = ActionType<typeof CommonActions>
