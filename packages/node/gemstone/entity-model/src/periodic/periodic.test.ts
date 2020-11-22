import { buildEntity, createActionHandlerFactory } from '@thrashplay/gemstone-engine'

import { PeriodicActions } from './actions'
import { makePeriodic, Periodic } from './periodic'

const createActionHandler = createActionHandlerFactory([Periodic])
const entity = buildEntity({ id: 'arbitrary-id' })
const periodicEntity = makePeriodic(entity)

describe('periodic facet', () => {
  it('adds support for timeElapsed actions', () => {
    const handler = createActionHandler(periodicEntity)
    expect(handler.supports(PeriodicActions.timeElapsed('world', 'arbitrary-id', { currentTime: 123 }))).toBe(true)
  })
})
