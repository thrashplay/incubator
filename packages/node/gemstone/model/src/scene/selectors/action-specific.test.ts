import {
  ActionFixtures,
  createStateWithDependencies,
  FrameFixtures,
  SceneStateFixtures,
} from '../__fixtures__'
import { SceneStateContainer } from '../state'

import { getDestination } from './action-specific'

const { TypicalActions } = FrameFixtures
const { Moving } = ActionFixtures
const { IdleBeforeTypicalActions, WithGimliRunning } = SceneStateFixtures

const defaultState: SceneStateContainer = createStateWithDependencies(IdleBeforeTypicalActions)
const withGimliRunnin: SceneStateContainer = createStateWithDependencies(WithGimliRunning)

describe('scene selectors - action-specific', () => {
  describe('getDestination', () => {
    it('returns current position if action is not "move"', () => {
      const result = getDestination(defaultState, { characterId: 'gimli' })
      expect(result).toEqual(TypicalActions.actors.gimli.position)
    })

    it('returns destination from a move action', () => {
      const result = getDestination(withGimliRunnin, { characterId: 'gimli' })
      expect(result).not.toEqual(TypicalActions.actors.gimli.position)
      expect(result).toEqual(Moving.data)
    })
  })
})
