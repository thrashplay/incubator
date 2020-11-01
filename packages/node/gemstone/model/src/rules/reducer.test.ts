import { CommonEvents } from '../common'

import { RulesStateFixtures } from './__fixtures__'
import { reduceRulesState } from './reducer'
import { RulesState } from './state'

const { Default } = RulesStateFixtures

describe('reduceRulesState', () => {
  describe('CommonEvents.initialized', () => {
    it('returns default state', () => {
      const result = reduceRulesState('any value' as unknown as RulesState, CommonEvents.initialized())
      expect(result).toStrictEqual(Default)
    })
  })
})
