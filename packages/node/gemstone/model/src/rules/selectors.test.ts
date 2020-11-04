import { MovementModes, Rules } from '../__fixtures__'

import { buildRules, forRulesSelector } from './builders'
import { getDefaultMovementMode, getDefaultMovementModeId, getMovementMode } from './selectors'
import { MovementMode, MovementModeId, RulesStateContainer } from './state'

const { Crawl, Walk, WithCane } = MovementModes

const state = forRulesSelector(Rules.RiddleOfTheSphinx)
const emptyState = forRulesSelector(buildRules())

const invalidState = { } as unknown as RulesStateContainer

describe('rules selectors', () => {
  describe('getDefaultMovementModeId', () => {
    it('returns empty string if no rules state', () => {
      expect(getDefaultMovementModeId(invalidState)).toBe('')
    })

    it('returns correct value', () => {
      expect(getDefaultMovementModeId(state)).toBe('walk')
    })
  })

  describe('getMovementMode', () => {
    it('returns undefined if no rules state', () => {
      expect(getMovementMode(invalidState, {})).toBeUndefined()
    })

    it('returns undefined if no ID specified', () => {
      expect(getMovementMode(state, {})).toBeUndefined()
    })

    it('returns undefined if mode does not exist', () => {
      expect(getMovementMode(state, { movementModeId: 'invalid-id' })).toBeUndefined()
    })

    it.each<[MovementModeId, MovementMode]>([
      ['crawl', Crawl],
      ['walk', Walk],
      ['with-cane', WithCane],
    ])('returns correct mode: %p', (id, mode) => {
      expect(getMovementMode(state, { movementModeId: id })).toStrictEqual(mode)
    })
  })

  describe('getDefaultMovementMode', () => {
    it('returns undefined if no rules state', () => {
      expect(getDefaultMovementMode(invalidState)).toBeUndefined()
    })

    it('returns undefined if ID is invalid', () => {
      expect(getDefaultMovementMode(emptyState)).toBeUndefined()
    })

    it('returns correct result if ID is valid', () => {
      expect(getDefaultMovementMode(state)).toStrictEqual(Walk)
    })
  })
})
