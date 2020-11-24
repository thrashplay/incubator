import { WORLD_ID } from './constants'
import { buildEntity } from './entity'
import { createActionExecutor, createSimulation } from './simulation'
import { createActionResponderFactory } from './simulation/action-responder-factory'
import { WORLD_TICK_ACTION } from './world-facet'
import { makeWorld, WorldFacet } from './world-facet/facet'
import { getWorldTime } from './world-facet/selectors'
import { buildWorldState, WorldStateBuilders } from './world-state'

const { addEntity } = WorldStateBuilders

const worldEntity = buildEntity({ id: WORLD_ID }, makeWorld())

const state = buildWorldState(
  addEntity(worldEntity)
)

// const mockLog = jest.fn<void, [LogEntry]>()

describe('engine API integration tests', () => {
  const simulation = createSimulation({
    actionExecutor: createActionExecutor(createActionResponderFactory([WorldFacet])),
    initialWorldState: state,
    // eslint-disable-next-line no-console
    log: console.log,
  })

  it('world entity has correct initial state', () => {
    const result = getWorldTime(simulation.getWorld()).just()
    expect(result).toEqual(0)
  })

  it('world has correct time after tick actions', () => {
    simulation.dispatch(WORLD_TICK_ACTION)
    simulation.dispatch(WORLD_TICK_ACTION)

    const result = getWorldTime(simulation.getWorld()).just()
    expect(result).toEqual(10)
  })
})
