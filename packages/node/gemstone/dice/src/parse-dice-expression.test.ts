import { parseDiceExpression } from './parse-dice-expression'

describe('parseDiceExpression', () => {
  describe('invalid strings return empty results', () => {
    const empty = { }

    it('empty string, null, etc', () => {
      expect(parseDiceExpression(undefined as unknown as string)).toEqual(empty)
      expect(parseDiceExpression(null as unknown as string)).toEqual(empty)
      expect(parseDiceExpression('' as unknown as string)).toEqual(empty)
      expect(parseDiceExpression('   ' as unknown as string)).toEqual(empty)
    })

    it('malformed expressions', () => {
      expect(parseDiceExpression('arbitrary text')).toEqual(empty)
      expect(parseDiceExpression('2dF+1')).toEqual(empty)
      expect(parseDiceExpression('2d6+z')).toEqual(empty)
    })

    it('negative die size', () => {
      expect(parseDiceExpression('2d-6')).toEqual(empty)
    })
  })

  describe('simple cases', () => {
    it('parses diceless constants', () => {
      expect(parseDiceExpression('5')).toEqual({ modifier: 5 })
      expect(parseDiceExpression('+1234')).toEqual({ modifier: 1234 })
      expect(parseDiceExpression('-4')).toEqual({ modifier: -4 })
    })

    it('parses single dice without a count', () => {
      expect(parseDiceExpression('d6')).toEqual({
        rolls: { diceNumber: 1, size: 6 },
      })
      expect(parseDiceExpression('d123')).toEqual({
        rolls: { diceNumber: 1, size: 123 },
      })
    })

    it('parses single die type with a count', () => {
      expect(parseDiceExpression('1d8')).toEqual({
        rolls: { diceNumber: 1, size: 8 },
      })
      expect(parseDiceExpression('10d6')).toEqual({
        rolls: { diceNumber: 10, size: 6 },
      })
    })
  })

  describe('one roll + modifier', () => {
    it('parses single dice without a count', () => {
      expect(parseDiceExpression('d10+3')).toEqual({
        rolls: { diceNumber: 1, size: 10 },
        modifier: 3,
      })
      expect(parseDiceExpression('d1000-50')).toEqual({
        rolls: { diceNumber: 1, size: 1000 },
        modifier: -50,
      })
    })

    it('parses single die type with a count', () => {
      expect(parseDiceExpression('1d8+0')).toEqual({
        rolls: { diceNumber: 1, size: 8 },
        modifier: 0,
      })
      expect(parseDiceExpression('100d10-10')).toEqual({
        rolls: { diceNumber: 100, size: 10 },
        modifier: -10,
      })
    })
  })

  describe('compound die rolls', () => {
    it('basic', () => {
      expect(parseDiceExpression('1d20+1d4')).toEqual({
        rolls: [
          { diceNumber: 1, size: 20 },
          { diceNumber: 1, size: 4 },
        ],
      })

      expect(parseDiceExpression('2d12+3d8')).toEqual({
        rolls: [
          { diceNumber: 2, size: 12 },
          { diceNumber: 3, size: 8 },
        ],
      })
    })

    it('complex', () => {
      expect(parseDiceExpression('2d4+3d6+4d8+5d10-5')).toEqual({
        modifier: -5,
        rolls: [
          { diceNumber: 2, size: 4 },
          { diceNumber: 3, size: 6 },
          { diceNumber: 4, size: 8 },
          { diceNumber: 5, size: 10 },
        ],
      })
    })

    it('with subtracted rolls', () => {
      expect(parseDiceExpression('2d12-d8+3')).toEqual({
        modifier: 3,
        rolls: [
          { diceNumber: 2, size: 12 },
          { diceNumber: 1, multiplier: -1, size: 8 },
        ],
      })

      expect(parseDiceExpression('2d12-1d10+2d4-123456d20+1')).toEqual({
        modifier: 1,
        rolls: [
          { diceNumber: 2, size: 12 },
          { diceNumber: 1, multiplier: -1, size: 10 },
          { diceNumber: 2, size: 4 },
          { diceNumber: 123456, multiplier: -1, size: 20 },
        ],
      })
    })
  })

  describe('removes d0 dice parts', () => {
    it('reduces single d0 dice parts to 0', () => {
      expect(parseDiceExpression('d0')).toEqual({ modifier: 0 })
      expect(parseDiceExpression('10d0')).toEqual({ modifier: 0 })
    })

    it('preserves constants', () => {
      expect(parseDiceExpression('1d0+1')).toEqual({ modifier: 1 })
      expect(parseDiceExpression('3d0+3')).toEqual({ modifier: 3 })
    })

    it('preserves other dice parts', () => {
      expect(parseDiceExpression('1d6+2d0-3d4+1')).toEqual({
        modifier: 1,
        rolls: [
          { diceNumber: 1, size: 6 },
          { diceNumber: 3, multiplier: -1, size: 4 },
        ],
      })
    })

    it('handles case with no dice number', () => {
      expect(parseDiceExpression('1d6+d0-3d4+1')).toEqual({
        modifier: 1,
        rolls: [
          { diceNumber: 1, size: 6 },
          { diceNumber: 3, multiplier: -1, size: 4 },
        ],
      })
      expect(parseDiceExpression('1d6-d0-3d4+1')).toEqual({
        modifier: 1,
        rolls: [
          { diceNumber: 1, size: 6 },
          { diceNumber: 3, multiplier: -1, size: 4 },
        ],
      })
    })

    it('collapses multiple d0 dice parts', () => {
      expect(parseDiceExpression('d0+1d6+2d0-3d4-30d0+2d0+1')).toEqual({
        modifier: 1,
        rolls: [
          { diceNumber: 1, size: 6 },
          { diceNumber: 3, multiplier: -1, size: 4 },
        ],
      })
    })
  })

  describe('simplifies d1 to constant', () => {
    it('reduces single d1 dice parts to constant', () => {
      expect(parseDiceExpression('d1')).toEqual({ modifier: 1 })
      expect(parseDiceExpression('10d1')).toEqual({ modifier: 10 })
    })

    it('negative d1 dice', () => {
      expect(parseDiceExpression('1d4-2d1+2')).toEqual({
        rolls: { diceNumber: 1, size: 4 },
        modifier: 0,
      })
      expect(parseDiceExpression('1d4-d1+2')).toEqual({
        rolls: { diceNumber: 1, size: 4 },
        modifier: 1,
      })
    })

    it('preserves constants', () => {
      expect(parseDiceExpression('1d1+1')).toEqual({ modifier: 2 })
      expect(parseDiceExpression('3d1+3')).toEqual({ modifier: 6 })
      expect(parseDiceExpression('d1+3')).toEqual({ modifier: 4 })
    })

    it('preserves other dice parts', () => {
      expect(parseDiceExpression('1d6+2d1-3d4+1')).toEqual({
        modifier: 3,
        rolls: [
          { diceNumber: 1, size: 6 },
          { diceNumber: 3, multiplier: -1, size: 4 },
        ],
      })
    })

    it('collapses multiple d1 dice parts to a single constant', () => {
      expect(parseDiceExpression('d1+1d6+2d1-3d4-30d1+d1-d1+2d1+1')).toEqual({
        modifier: -24,
        rolls: [
          { diceNumber: 1, size: 6 },
          { diceNumber: 3, multiplier: -1, size: 4 },
        ],
      })
    })
  })
})
