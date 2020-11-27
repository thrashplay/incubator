import { action } from 'typesafe-actions'

import { buildEntity, createActionHandlerFactory } from '@thrashplay/gemstone-engine'

import { PeriodicActions } from './actions'
import { makePeriodic, Periodic } from './periodic'

const createActionHandler = createActionHandlerFactory([Periodic])
const entity = buildEntity({ id: 'arbitrary-id' })
const periodicEntity = makePeriodic(entity)

describe('periodic facet', () => {
  it.todo('adds support for timeElapsed actions')

  // , () => {

  //   since the target id is in the action, should we have to create an entity specific handler at this level ?? or should there be some engine component for that

  //   const handler = createActionHandler(periodicEntity)
  //   expect(handler.supports(PeriodicActions.timeElapsed('world', 'arbitrary-id', { currentTime: 123 }))).toBe(true)
  // })
})
