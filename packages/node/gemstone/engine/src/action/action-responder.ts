import { Either } from 'monet'

import { LogEntry } from '../log'
import { WorldState } from '../world-state'

import { ActionResult, AnyAction } from './action-handler'

export interface ActionResponder<TSupportedActions extends AnyAction = AnyAction> {
  respond: (action: TSupportedActions, world: WorldState) => Either<LogEntry, ActionResult>
  supports: (action: AnyAction) => boolean
}
