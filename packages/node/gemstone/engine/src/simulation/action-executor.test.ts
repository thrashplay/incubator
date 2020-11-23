import { Dictionary } from '@thrashplay/gemstone-model'

import { ActionHandler, ActionResult, AnyAction, EMPTY_ACTION_RESULT } from '../action'
import { buildEntity, Entity } from '../entity'
import { createEntityTransformation, createWorldTransformation } from '../transformation'
import { buildWorldState, WORLD_ID, WorldState, WorldStateBuilders } from '../world-state'

import { createActionExecutor } from './action-executor'

const { addEntity } = WorldStateBuilders

const entity1 = buildEntity({ id: 'entity1' })
const entity2 = buildEntity({ id: 'entity2' })

const world = buildWorldState(
  addEntity(entity1),
  addEntity(entity2)
)

const actionHandlerForEntity1 = {
  handle: jest.fn<ActionResult, [AnyAction, WorldState]>(() => EMPTY_ACTION_RESULT),
  supports: jest.fn(() => false) as any,
}

const actionHandlerMap: Dictionary<Entity['id'], ActionHandler> = {
  [entity1.id]: actionHandlerForEntity1,
}

const mockActionHandlerFactory = jest.fn((entity: Entity) => {
  return actionHandlerMap[entity.id]
})

const createActionTargeting = (entityId: Entity['id']) => ({
  source: WORLD_ID,
  target: entityId,
  type: 'any-arbitrary-type',
})

describe('ActionExecutor tests', () => {
  const executeAction = createActionExecutor(mockActionHandlerFactory)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('invalid action', () => {
    it('returns error state when target does not exist', () => {
      const result = executeAction(createActionTargeting('invalid-id'), world)
      expect(result.isLeft()).toBe(true)
    })

    it('returns error state when target does not support the action', () => {
      const result = executeAction(createActionTargeting(entity1.id), world)
      expect(result.isLeft()).toBe(true)
    })
  })

  describe('supported action', () => {
    beforeEach(() => {
      actionHandlerForEntity1.supports.mockReturnValue(true)
    })

    it('passes correct world state to action handler', () => {
      executeAction(createActionTargeting(entity1.id), world)
      expect(actionHandlerForEntity1.handle).toHaveBeenCalledTimes(1)
      expect(actionHandlerForEntity1.handle).toHaveBeenCalledWith(
        expect.any(Object),
        world
      )
    })

    it('passes correct action to supports function', () => {
      const action = createActionTargeting(entity1.id)

      executeAction(action, world)
      expect(actionHandlerForEntity1.supports).toHaveBeenCalledTimes(1)
      expect(actionHandlerForEntity1.supports).toHaveBeenCalledWith(action)
    })
  })

  describe('transformation result handling', () => {
    const createAddEntityTransformation = createWorldTransformation(
      'add-entity',
      (world: WorldState, id: string) => addEntity(buildEntity({ id }))(world)
    )

    const createSetNameTransformer = createEntityTransformation(
      'set-name',
      (entity: Entity, name: string) => ({
        ...entity,
        name,
      })
    )

    it('returns a state change for Transformations returned by the handler', () => {
      const singleTransformationResult: ActionResult = {
        reactions: [],
        transformations: [
          createAddEntityTransformation('newEntity'),
        ],
      }
      actionHandlerForEntity1.handle.mockReturnValue(singleTransformationResult)

      const result = executeAction(createActionTargeting(entity1.id), world)
      expect(result.isRight()).toBe(true)
      expect(result.right()).toHaveLength(1)

      const changedState = result.right()[0].apply(world)
      expect(changedState.entities.newEntity).toBeDefined()
      expect(changedState.entities.newEntity.id).toEqual('newEntity')
    })

    it('returns all expected state changes when multiple Transformations returned by the handler', () => {
      const multipleTransformationResult: ActionResult = {
        reactions: [],
        transformations: [
          createAddEntityTransformation('newEntity'),
          createSetNameTransformer('newEntity', 'Expected Name'),
        ],
      }
      actionHandlerForEntity1.handle.mockReturnValue(multipleTransformationResult)

      const result = executeAction(createActionTargeting(entity1.id), world)
      expect(result.isRight()).toBe(true)
      expect(result.right()).toHaveLength(2)

      let changedState = result.right()[0].apply(world)
      changedState = result.right()[1].apply(changedState)
      expect(changedState.entities.newEntity).toBeDefined()
      expect(changedState.entities.newEntity.name).toEqual('Expected Name')
    })
  })
})
