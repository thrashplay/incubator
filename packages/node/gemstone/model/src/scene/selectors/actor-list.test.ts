import { keys, omit } from 'lodash/fp'

import { ActorStatuses, CharacterRecords, Characters, forSceneSelector, Rules, Scenes } from '../../__fixtures__'
import { buildActor } from '../frame/builders'
import { EMPTY_SCENE, SceneStateContainer } from '../state'

import {
  getActor,
  getActorCollection,
  getActors,
  getActorStatusCollection,
  getCharacterIds,
} from './actor-list'

const { Gimli, Treestump, Trogdor } = Characters
const { WithGimli, WithGimliAndTrogdor } = CharacterRecords
const { RiddleOfTheSphinx } = Rules
const { IdleBeforeTypicalActions } = Scenes

const defaultState: SceneStateContainer = forSceneSelector(IdleBeforeTypicalActions)

// this is an impossible state, but can be used to test what happens if 'frames' is somehow empty
const emptyState: SceneStateContainer = forSceneSelector({
  ...EMPTY_SCENE,
  frames: [] as any,
})

const invalidState = { } as unknown as SceneStateContainer

const gimliActor = buildActor({
  character: Gimli,
  status: ActorStatuses.Gimli.BefriendingElves,
})

const treestumpActor = buildActor({
  character: Treestump,
  status: ActorStatuses.Treestump.Grumbling,
})

const trogdorActor = buildActor({
  character: Trogdor,
  status: ActorStatuses.Trogdor.Burninating,
})

describe('scene selectors - Actor List', () => {
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
      expect(result).toHaveLength(3)
      expect(result).toContain('gimli')
      expect(result).toContain('treestump')
      expect(result).toContain('trogdor')
    })

    it('does not return monster IDs', () => {
      expect('it is implemented').toBe(true)
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
    const stateWithoutTrogdor = ({
      characters: WithGimli,
      rules: RiddleOfTheSphinx,
      scene: IdleBeforeTypicalActions,
    })

    it('returns undefined if scene state is invalid', () => {
      const result = getActors(invalidState)
      expect(result).toStrictEqual([])
    })

    it('omits actors if character state is missing', () => {
      const result = getActors(stateWithoutTrogdor)
      expect(result).toHaveLength(1)
      expect(result).toContainEqual(gimliActor)
    })

    it('returns actors when all data is available', () => {
      const result = getActors(defaultState)
      expect(result).toHaveLength(3)
      expect(result).toContainEqual(gimliActor)
      expect(result).toContainEqual(treestumpActor)
      expect(result).toContainEqual(trogdorActor)
    })
  })

  describe('getActor', () => {
    const stateWithoutTrogdor = ({
      characters: WithGimli,
      rules: RiddleOfTheSphinx,
      scene: IdleBeforeTypicalActions,
    })

    it('returns undefined if character ID is invalid', () => {
      const result = getActor(invalidState, { characterId: 'invalid-id' })
      expect(result).toBeUndefined()
    })

    it('returns undefined when character data missing', () => {
      const result = getActor(stateWithoutTrogdor, { characterId: 'trogdor' })
      expect(result).toBeUndefined()
    })

    describe('status data missing', () => {
      const sceneStateMissing = ({
        characters: WithGimliAndTrogdor,
        rules: RiddleOfTheSphinx,
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
        expect(result).toStrictEqual(gimliActor)
      })
    })
  })
})
