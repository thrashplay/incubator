import { Point } from '../types'

import {
  CharacterStateFixtures,
  FrameFixtures,
  IntentionFixtures,
  RulesStateFixtures,
  SceneStateFixtures,
} from './__fixtures__'
import {
  getActor,
  getActorCollection,
  getActors,
  getActorStatusCollection,
  getActorStatuses,
  getCharacterIds,
  getCurrentFrame,
  getCurrentFrameNumber,
  getCurrentIntention,
  getCurrentPosition,
  getCurrentStatus,
} from './selectors'
import { ActorStatus, Frame, IntentionState, SceneState, SceneStateContainer } from './state'
import { keys, omit } from 'lodash/fp'

const { GimliAndTrogdor } = CharacterStateFixtures
const { AllIdle, Empty, TypicalIntentions } = FrameFixtures
const { BefriendingElves, Burninating } = IntentionFixtures
const { Minimal } = RulesStateFixtures
const { Default, IdleBeforeTypicalIntentions, SingleTypicalFrame, SingleIdleFrame } = SceneStateFixtures

const createContainer = (scene: SceneState): SceneStateContainer => ({
  characters: GimliAndTrogdor,
  rules: Minimal,
  scene,
})

const defaultState: SceneStateContainer = createContainer(IdleBeforeTypicalIntentions)

// this is an impossible state, but can be used to test what happens if 'frames' is somehow empty
const emptyState: SceneStateContainer = createContainer({
  characters: [],
  frameOffset: 0,
  frames: [],
})

const invalidState = { } as unknown as SceneStateContainer

describe('scene selectors', () => {
  describe('getCurrentFrameNumber', () => {
    it('returns zero if scene state is missing', () => {
      const result = getCurrentFrameNumber(invalidState)
      expect(result).toBe(0)
    })

    it('returns frameOffset if scene state has no frames', () => {
      const result = getCurrentFrameNumber(createContainer({
        ...IdleBeforeTypicalIntentions,
        frames: [],
      }))

      expect(result).toBe(42)
    })

    it.each<[string, SceneState, number]>([
      ['Default', Default, 0],
      ['SingleTypicalFrame', SingleTypicalFrame, 10],
      ['IdleBeforeTypicalIntentions', IdleBeforeTypicalIntentions, 43],
    ])('returns frameOffset + current frame index: %p', (_fixture, state, expectedResult) => {
      const result = getCurrentFrameNumber(createContainer(state))
      expect(result).toBe(expectedResult)
    })
  })

  describe('getCurrentFrame', () => {
    it('returns empty frame if scene state is missing', () => {
      const result = getCurrentFrame(invalidState)
      expect(result).toStrictEqual(Empty)
    })

    it('returns empty frame if scene state has no frames', () => {
      const result = getCurrentFrame(emptyState)
      expect(result).toStrictEqual(Empty)
    })

    it.each<[string, SceneState, Frame]>([
      ['SingleIdleFrame', SingleIdleFrame, AllIdle],
      ['IdleBeforeTypicalIntentions', IdleBeforeTypicalIntentions, TypicalIntentions],
    ])('returns correct frame for: %p', (_fixture, state, expectedFrame) => {
      const result = getCurrentFrame(createContainer(state))
      expect(result).toStrictEqual(expectedFrame)
    })
  })

  describe('getCharacterIds', () => {
    it('returns empty array if scene state is missing', () => {
      const result = getCharacterIds(invalidState)
      expect(result).toStrictEqual([])
    })

    it('returns empty array if scene has no characters', () => {
      const result = getCharacterIds(omit('characters')(emptyState) as SceneStateContainer)
      expect(result).toStrictEqual([])
    })

    it('returns correct data', () => {
      const result = getCharacterIds(defaultState)
      expect(result).toHaveLength(2)
      expect(result).toContain('gimli')
      expect(result).toContain('trogdor')
    })
  })

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
      const result = getActorStatuses(createContainer(IdleBeforeTypicalIntentions))
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

    it.each<[string, IntentionState]>([
      ['gimli', BefriendingElves],
      ['trogdor', Burninating],
    ])('returns correct data: %p', (characterId, expectedIntention) => {
      const result = getCurrentIntention(defaultState, { characterId })
      expect(result).toStrictEqual(expectedIntention)
    })
  })

  describe('getActorStatusCollection', () => {
    // more cases are covered by other tests, this is just to provide visibility into if this
    // subselector is the cause of any future bugs
    it('has expected character IDs', () => {
      const result = getActorStatusCollection(defaultState)
      expect(keys(result)).toContain('gimli')
      expect(keys(result)).toContain('trogdor')
    })

    it('matches snapshot', () => {
      const result = getActorStatusCollection(defaultState)
      expect(result).toMatchSnapshot()
    })
  })

  describe('getActorCollection', () => {
    // more cases are covered by other tests, this is just to provide visibility into if this
    // subselector is the cause of any future bugs
    it('has expected character IDs', () => {
      const result = getActorCollection(defaultState)
      expect(keys(result)).toContain('gimli')
      expect(keys(result)).toContain('trogdor')
    })

    it('matches snapshot', () => {
      const result = getActorCollection(defaultState)
      expect(result).toMatchSnapshot()
    })
  })

  describe('getActors', () => {
    it('returns undefined if scene state is invalid', () => {
      const result = getActors(invalidState)
      expect(result).toStrictEqual([])
    })

    it('returns status details if character state is missing', () => {
      const gimliStatusDetailsOnly = {
        id: 'gimli',
        status: {
          intention: IntentionFixtures.BefriendingElves,
          position: { x: 100, y: 100 },
        },
      }
      const trogdorStatusDetailsOnly = {
        id: 'trogdor',
        status: {
          intention: IntentionFixtures.Burninating,
          position: { x: 7, y: 7 },
        },
      }

      const stateWithoutCharacters = ({
        rules: Minimal,
        scene: IdleBeforeTypicalIntentions,
      }) as unknown as SceneStateContainer

      const result = getActors(stateWithoutCharacters)
      expect(result).toHaveLength(2)
      expect(result).toContainEqual(gimliStatusDetailsOnly)
      expect(result).toContainEqual(trogdorStatusDetailsOnly)
    })

    it('returns actors when all data is available', () => {
      const gimli = {
        id: 'gimli',
        name: 'Gimli, son of Glóin',
        speed: 60,
        status: {
          intention: IntentionFixtures.BefriendingElves,
          position: { x: 100, y: 100 },
        },
      }
      const trogdor = {
        id: 'trogdor',
        name: 'Trogdor, the Burninator',
        speed: 120,
        status: {
          intention: IntentionFixtures.Burninating,
          position: { x: 7, y: 7 },
        },
      }

      const result = getActors(defaultState)
      expect(result).toHaveLength(2)
      expect(result).toContainEqual(gimli)
      expect(result).toContainEqual(trogdor)
    })
  })

  describe('getActor', () => {
    it('returns undefined if character ID is invalid', () => {
      const result = getActor(invalidState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    describe('character data missing', () => {
      const statusDetailsOnly = {
        id: 'gimli',
        status: {
          intention: IntentionFixtures.BefriendingElves,
          position: { x: 100, y: 100 },
        },
      }

      it('returns status details if character state is missing', () => {
        const stateWithoutCharacters = ({
          rules: Minimal,
          scene: IdleBeforeTypicalIntentions,
        }) as unknown as SceneStateContainer

        const result = getActor(stateWithoutCharacters, { characterId: 'gimli' })
        expect(result).toStrictEqual(statusDetailsOnly)
      })
    })

    describe('status data missing', () => {
      const sceneStateMissing = ({
        characters: GimliAndTrogdor,
        rules: Minimal,
      }) as unknown as SceneStateContainer

      it('returns undefined if scene state is missing', () => {
        const result = getActor(sceneStateMissing, { characterId: 'gimli' })
        expect(result).toBeUndefined()
      })

      it('returns undefined details if scene has no frames', () => {
        const result = getActor(emptyState, { characterId: 'gimli' })
        expect(result).toBeUndefined()
      })
    })

    describe('all data available', () => {
      it('returns correct data', () => {
        const result = getActor(defaultState, { characterId: 'gimli' })
        expect(result).toStrictEqual({
          id: 'gimli',
          name: 'Gimli, son of Glóin',
          speed: 60,
          status: {
            intention: IntentionFixtures.BefriendingElves,
            position: { x: 100, y: 100 },
          },
        })
      })
    })
  })
})
