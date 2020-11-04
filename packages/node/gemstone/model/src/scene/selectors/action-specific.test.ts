
import { Actions, forSceneSelector, Frames, Scenes } from '../../__fixtures__'
import { SceneStateContainer } from '../state'

import { getDestination } from './action-specific'

const { TypicalActions } = Frames
const { Moving } = Actions
const { IdleBeforeTypicalActions, WithGimliRunning } = Scenes

const defaultState: SceneStateContainer = forSceneSelector(IdleBeforeTypicalActions)
const withGimliRunning: SceneStateContainer = forSceneSelector(WithGimliRunning)

describe('scene selectors - action-specific', () => {
  describe('getDestination', () => {
    it('returns current position if action is not "move"', () => {
      const result = getDestination(defaultState, { characterId: 'gimli' })
      expect(result).toEqual(TypicalActions.actors.gimli.position)
    })

    it('returns destination from a move action', () => {
      const result = getDestination(withGimliRunning, { characterId: 'gimli' })
      expect(result).not.toEqual(TypicalActions.actors.gimli.position)
      expect(result).toEqual(Moving.data)
    })
  })
})
