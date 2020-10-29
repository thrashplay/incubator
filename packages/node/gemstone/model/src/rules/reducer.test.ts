import { CommonActions } from '../common'

import { RulesStateFixtures } from './__fixtures__'
import { reduceRulesState } from './reducer'
import { RulesState } from './state'

const { Default } = RulesStateFixtures

describe('reduceRulesState', () => {
  describe('CommonActions.initialized', () => {
    it('returns default state', () => {
      const result = reduceRulesState('any value' as unknown as RulesState, CommonActions.initialized())
      expect(result).toStrictEqual(Default)
    })
  })
})
