import { Point } from '../../common'
import {
  CharacterFixtures,
  createStateWithDependencies,
  FrameFixtures,
  IntentionFixtures,
  RulesStateFixtures,
  SceneStateFixtures,
} from '../__fixtures__'
import { ActorStatus, IntentionType } from '../frame'
import { SceneStateContainer } from '../state'

import {
  getActiveMovementMode,
  getActorStatuses,
  getIntention,
  getPosition,
  getStatus,
} from '.'
import { getCurrentSpeed } from './actor-status'

const { Gimli } = CharacterFixtures
const { TypicalIntentions } = FrameFixtures
const { BefriendingElves, Burninating } = IntentionFixtures
const { Minimal } = RulesStateFixtures
const { IdleBeforeTypicalIntentions, WithGimliRunning } = SceneStateFixtures

const defaultState: SceneStateContainer = createStateWithDependencies(IdleBeforeTypicalIntentions)
const withGimliRunning: SceneStateContainer = createStateWithDependencies(WithGimliRunning)

// this is an impossible state, but can be used to test what happens if 'frames' is somehow empty
const emptyState: SceneStateContainer = createStateWithDependencies({
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
      const result = getActorStatuses(createStateWithDependencies(IdleBeforeTypicalIntentions))
      expect(result).toHaveLength(2)
      expect(result).toContain(TypicalIntentions.actors.gimli)
      expect(result).toContain(TypicalIntentions.actors.trogdor)
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
      ['gimli', TypicalIntentions.actors.gimli],
      ['trogdor', TypicalIntentions.actors.trogdor],
    ])('returns correct data: %p', (characterId, expectedStatus) => {
      const result = getStatus(defaultState, { characterId })
      expect(result).toStrictEqual(expectedStatus)
    })
  })

  describe('getPosition', () => {
    it('returns undefined if scene state is missing', () => {
      const result = getPosition(invalidState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if scene has no frames', () => {
      const result = getPosition(emptyState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is not specified', () => {
      const result = getPosition(defaultState, {})
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getPosition(defaultState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it.each<[string, Point]>([
      ['gimli', { x: 100, y: 100 }],
      ['trogdor', { x: 7, y: 7 }],
    ])('returns correct data: %p', (characterId, expectedPosition) => {
      const result = getPosition(defaultState, { characterId })
      expect(result).toStrictEqual(expectedPosition)
    })
  })

  describe('getIntention', () => {
    it('returns undefined if scene state is missing', () => {
      const result = getIntention(invalidState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if scene has no frames', () => {
      const result = getIntention(emptyState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is not specified', () => {
      const result = getIntention(defaultState, {})
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getIntention(defaultState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it.each<[string, IntentionType]>([
      ['gimli', BefriendingElves],
      ['trogdor', Burninating],
    ])('returns correct data: %p', (characterId, expectedIntention) => {
      const result = getIntention(defaultState, { characterId })
      expect(result).toStrictEqual(expectedIntention)
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
})
