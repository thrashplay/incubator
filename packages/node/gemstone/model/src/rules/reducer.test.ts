import { Rules } from '../__fixtures__'
import { CommonEvents } from '../common'

import { reduceRulesState } from './reducer'
import { RulesState } from './state'

const { Default } = Rules

describe('reduceRulesState', () => {
  describe('CommonEvents.initialized', () => {
    it('returns default state', () => {
      const result = reduceRulesState('any value' as unknown as RulesState, CommonEvents.initialized())
      expect(result).toStrictEqual(Default)
    })
  })
})
