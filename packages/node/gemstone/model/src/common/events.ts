import { ActionType, createAction } from 'typesafe-actions'

export const CommonEvents = {
  initialized: createAction('common/initialized')(),
}

export type CommonEvent = ActionType<typeof CommonEvents>
