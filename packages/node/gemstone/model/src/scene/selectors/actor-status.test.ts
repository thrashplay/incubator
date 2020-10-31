
import { Point } from '../../common'
import {
  createStateWithDependencies,
  FrameFixtures,
  IntentionFixtures,
  SceneStateFixtures,
} from '../__fixtures__'
import { ActorStatus, IntentionType } from '../frame'
import { SceneStateContainer } from '../state'

import {
  getActorStatuses,
  getCurrentIntention,
  getCurrentPosition,
  getCurrentStatus,
} from '.'

const { TypicalIntentions } = FrameFixtures
const { BefriendingElves, Burninating } = IntentionFixtures
const { IdleBeforeTypicalIntentions } = SceneStateFixtures

const defaultState: SceneStateContainer = createStateWithDependencies(IdleBeforeTypicalIntentions)

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

  describe('getCurrentStatus', () => {
    it('returns undefined if scene state is missing', () => {
      const result = getCurrentStatus(invalidState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if scene has no frames', () => {
      const result = getCurrentStatus(emptyState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is not specified', () => {
      const result = getCurrentStatus(defaultState, {})
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getCurrentStatus(defaultState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it.each<[string, ActorStatus]>([
      ['gimli', TypicalIntentions.actors.gimli],
      ['trogdor', TypicalIntentions.actors.trogdor],
    ])('returns correct data: %p', (characterId, expectedStatus) => {
      const result = getCurrentStatus(defaultState, { characterId })
      expect(result).toStrictEqual(expectedStatus)
    })
  })

  describe('getCurrentPosition', () => {
    it('returns undefined if scene state is missing', () => {
      const result = getCurrentPosition(invalidState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if scene has no frames', () => {
      const result = getCurrentPosition(emptyState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is not specified', () => {
      const result = getCurrentPosition(defaultState, {})
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getCurrentPosition(defaultState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it.each<[string, Point]>([
      ['gimli', { x: 100, y: 100 }],
      ['trogdor', { x: 7, y: 7 }],
    ])('returns correct data: %p', (characterId, expectedPosition) => {
      const result = getCurrentPosition(defaultState, { characterId })
      expect(result).toStrictEqual(expectedPosition)
    })
  })

  describe('getCurrentIntention', () => {
    it('returns undefined if scene state is missing', () => {
      const result = getCurrentIntention(invalidState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if scene has no frames', () => {
      const result = getCurrentIntention(emptyState, { characterId: 'gimli' })
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is not specified', () => {
      const result = getCurrentIntention(defaultState, {})
      expect(result).toBeUndefined()
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getCurrentIntention(defaultState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it.each<[string, IntentionType]>([
      ['gimli', BefriendingElves],
      ['trogdor', Burninating],
    ])('returns correct data: %p', (characterId, expectedIntention) => {
      const result = getCurrentIntention(defaultState, { characterId })
      expect(result).toStrictEqual(expectedIntention)
    })
  })
})
