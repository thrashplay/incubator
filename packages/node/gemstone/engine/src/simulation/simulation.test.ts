import { identity } from 'lodash'
import { Either } from 'monet'

import { Action } from '../action'
import { EMPTY_ARRAY, WORLD_ID } from '../constants'
import { buildEntity } from '../entity'
import { LogEntry } from '../log'
import { StateChange, WorldState } from '../world-state'

import { createSimulation } from './simulation'

const mockLog = jest.fn<void, [LogEntry]>()
const mockActionExecutor = jest.fn<Either<LogEntry, readonly StateChange[]>, [Action, WorldState]>()

const ARBITRARY_ACTION: Action = {
  source: WORLD_ID,
  target: WORLD_ID,
  type: 'arbitrary-action-type',
}

describe('simulation', () => {
  const simulation = createSimulation({
    actionExecutor: mockActionExecutor,
    log: mockLog,
  })

  const initialWorld = simulation.getWorld()

  beforeEach(() => {
    jest.clearAllMocks()
    mockActionExecutor.mockReturnValue(Either.Right(EMPTY_ARRAY))
  })

  describe('dispatch', () => {
    it('calls configured action executor', () => {
      simulation.dispatch(ARBITRARY_ACTION)
      expect(mockActionExecutor).toHaveBeenCalledTimes(1)
      expect(mockActionExecutor).toHaveBeenCalledWith(ARBITRARY_ACTION, initialWorld)
    })

    it('logs action errors when dispatching fails', () => {
      mockActionExecutor.mockReturnValue(Either.Left('Expected failure during test.'))

      simulation.dispatch(ARBITRARY_ACTION)
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledWith('Expected failure during test.')
    })

    it('applies all world state changes in a chain', () => {
      const intermediateWorldState = {
        entities: {
          newEntity: buildEntity({ id: 'newEntity' }),
        },
      }

      const expectedWorldState = {
        entities: {
          newEntity: buildEntity({ id: 'newEntity' }),
        },
      }

      const mockApply1 = jest.fn(() => intermediateWorldState)
      const mockApply2 = jest.fn(() => expectedWorldState)

      mockActionExecutor.mockReturnValue(Either.Right([
        {
          apply: mockApply1,
          getLogEntry: () => 'unused value',
        },
        {
          apply: mockApply2,
          getLogEntry: () => 'unused value',
        },
      ]))

      simulation.dispatch(ARBITRARY_ACTION)
      expect(mockApply1).toHaveBeenCalledTimes(1)
      expect(mockApply1).toHaveBeenCalledWith(initialWorld)
      expect(mockApply2).toHaveBeenCalledTimes(1)
      expect(mockApply2).toHaveBeenCalledWith(intermediateWorldState)
      expect(simulation.getWorld()).toEqual(expectedWorldState)
    })

    it('logs all state changes when action is successful', () => {
      mockActionExecutor.mockReturnValue(Either.Right([
        {
          apply: identity,
          getLogEntry: () => 'log entry 1',
        },
        {
          apply: identity,
          getLogEntry: () => 'log entry 2',
        },
      ]))

      simulation.dispatch(ARBITRARY_ACTION)
      expect(mockLog).toHaveBeenCalledWith('log entry 1')
      expect(mockLog).toHaveBeenCalledWith('log entry 2')
    })
  })
})
