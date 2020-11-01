import { Point } from '../../common'
import {
  ActionFixtures,
  CharacterFixtures,
  createStateWithDependencies,
  FrameFixtures,
  RulesStateFixtures,
  SceneStateFixtures,
} from '../__fixtures__'
import { ActionType, ActorStatus } from '../frame'
import { EMPTY_SCENE, SceneStateContainer } from '../state'

import {
  getAction,
  getActiveMovementMode,
  getActorStatuses,
  getPosition,
  getStatus,
} from '.'
import { getCurrentSpeed, getReachableTargets } from './actor-status'

const { Gimli } = CharacterFixtures
const { TypicalActions } = FrameFixtures
const { BefriendingElves, Burninating } = ActionFixtures
const { Minimal } = RulesStateFixtures
const { IdleBeforeTypicalActions, WithGimliAndTreestumpInMelee, WithGimliRunning } = SceneStateFixtures

const defaultState: SceneStateContainer = createStateWithDependencies(IdleBeforeTypicalActions)
const withGimliRunning: SceneStateContainer = createStateWithDependencies(WithGimliRunning)
const withMelee = createStateWithDependencies(WithGimliAndTreestumpInMelee)

// this is an impossible state, but can be used to test what happens if 'frames' is somehow empty
const emptyState: SceneStateContainer = createStateWithDependencies({
  ...EMPTY_SCENE,
  characters: [],
  frames: [],
})

const invalidState = { } as unknown as SceneStateContainer

describe('scene selectors - Actor Status', () => {
  describe('getActorStatuses', () => {
    it('returns empty array if scene state is missing', () => {
      const result = getActorStatuses(invalidState)
      expect(result).toStrictEqual([])
    })

    it('returns empty array if scene has no frames', () => {
      const result = getActorStatuses(emptyState)
      expect(result).toStrictEqual([])
    })

    it('returns correct status objects from last frame', () => {
      const result = getActorStatuses(createStateWithDependencies(IdleBeforeTypicalActions))
      expect(result).toHaveLength(2)
      expect(result).toContain(TypicalActions.actors.gimli)
      expect(result).toContain(TypicalActions.actors.trogdor)
    })
  })

  describe('getStatus', () => {
    it('returns undefined if scene state is missing', () => {
      const result = getStatus(invalidState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if scene has no frames', () => {
      const result = getStatus(emptyState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is not specified', () => {
      const result = getStatus(defaultState, {})
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getStatus(defaultState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it.each<[string, ActorStatus]>([
      ['gimli', TypicalActions.actors.gimli],
      ['trogdor', TypicalActions.actors.trogdor],
    ])('returns correct data: %p', (characterId, expectedStatus) => {
      const result = getStatus(defaultState, { characterId })
      expect(result).toStrictEqual(expectedStatus)
    })
  })

  describe('getPosition', () => {
    const origin = { x: 0, y: 0 }
    it('returns origin if scene state is missing', () => {
      const result = getPosition(invalidState, { characterId: 'gimli' })
      expect(result).toEqual(origin)
    })

    it('returns origin if scene has no frames', () => {
      const result = getPosition(emptyState, { characterId: 'gimli' })
      expect(result).toEqual(origin)
    })

    it('returns origin if character ID is not specified', () => {
      const result = getPosition(defaultState, {})
      expect(result).toEqual(origin)
    })

    it('returns origin if character ID is invalid', () => {
      const result = getPosition(defaultState, { characterId: 'invalid-id' })
      expect(result).toEqual(origin)
    })

    it.each<[string, Point]>([
      ['gimli', { x: 100, y: 100 }],
      ['trogdor', { x: 7, y: 7 }],
    ])('returns correct data: %p', (characterId, expectedPosition) => {
      const result = getPosition(defaultState, { characterId })
      expect(result).toStrictEqual(expectedPosition)
    })
  })

  describe('getAction', () => {
    it('returns undefined if scene state is missing', () => {
      const result = getAction(invalidState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if scene has no frames', () => {
      const result = getAction(emptyState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is not specified', () => {
      const result = getAction(defaultState, {})
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getAction(defaultState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it.each<[string, ActionType]>([
      ['gimli', BefriendingElves],
      ['trogdor', Burninating],
    ])('returns correct data: %p', (characterId, expectedAction) => {
      const result = getAction(defaultState, { characterId })
      expect(result).toStrictEqual(expectedAction)
    })
  })

  describe('getActiveMovementMode', () => {
    it('returns system default if undefined', () => {
      const result = getActiveMovementMode(defaultState, { characterId: 'gimli' })
      expect(result).toStrictEqual(Minimal.movement.modes.standard)
    })

    it('returns correct value', () => {
      const result = getActiveMovementMode(withGimliRunning, { characterId: 'gimli' })
      expect(result).toStrictEqual(Minimal.movement.modes.run)
    })
  })

  describe('getCurrentSpeed', () => {
    it('when no movement mode is specified, default is used', () => {
      const result = getCurrentSpeed(defaultState, { characterId: 'gimli' })

      const defaultMovementModeId = Minimal.movement.defaultMode
      const multiplier = Minimal.movement.modes[defaultMovementModeId]?.multiplier
      const expectedResult = Gimli.speed * multiplier
      expect(result).toBe(expectedResult)
    })

    it('uses correct movement mode multiplier', () => {
      const result = getCurrentSpeed(withGimliRunning, { characterId: 'gimli' })

      const multiplier = Minimal.movement.modes.run.multiplier
      const expectedResult = Gimli.speed * multiplier
      expect(result).toBe(expectedResult)
    })
  })

  describe('getReachableTargets', () => {
    it('does not include self', () => {
      const result = getReachableTargets(withMelee, { characterId: 'gimli' })
      expect(result).not.toContainEqual(expect.objectContaining({
        id: 'gimli',
      }))
    })

    it('does not include out of range targets', () => {
      const result = getReachableTargets(withMelee, { characterId: 'gimli' })
      expect(result).not.toContainEqual(expect.objectContaining({
        id: 'trogdor',
      }))
    })

    it('includes correct results', () => {
      const result = getReachableTargets(withMelee, { characterId: 'gimli' })
      expect(result).toHaveLength(1)
      expect(result).toContainEqual(expect.objectContaining({
        id: 'treestump',
      }))
    })
  })
})
