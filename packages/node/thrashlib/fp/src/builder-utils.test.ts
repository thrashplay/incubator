import { add, remove, update } from './builder-utils'

type TestType = {
  id: string
  name: string
  nickname?: string
}

// create some arbitrary data
const robert = {
  id: 'robert',
  name: 'Robert',
  nickname: 'bob',
}

const jim = {
  id: 'jim',
  name: 'Jim',
}

const sally = {
  id: 'sally',
  name: 'Sally',
}

const putNameInQuotes = (input: TestType) => ({
  ...input,
  name: `"${input.name}"`,
})

describe('builder helpers', () => {
  describe('array versions', () => {
    describe('add', () => {
      it('adds to an empty array', () => {
        const result = add([], robert)
        expect(result).toHaveLength(1)
        expect(result).toContainEqual(robert)
      })

      it('adds to a non-empty array', () => {
        const result = add([jim], robert)
        expect(result).toHaveLength(2)
        expect(result[0]).toEqual(jim)
        expect(result[1]).toEqual(robert)
      })
    })

    describe('remove', () => {
      it('returns empty array if input empty', () => {
        const result = remove([], 0)
        expect(result).toHaveLength(0)
      })

      it('does nothing if index negative', () => {
        const result = remove([robert], -1)
        expect(result).toHaveLength(1)
        expect(result).toContainEqual(robert)
      })

      it('does nothing if index too high', () => {
        const result = remove([robert], 1)
        expect(result).toHaveLength(1)
        expect(result).toContainEqual(robert)
      })

      it('removes last remaining item', () => {
        const result = remove([robert], 0)
        expect(result).toHaveLength(0)
      })

      it('removes first item', () => {
        const result = remove([jim, robert, sally], 0)
        expect(result).toHaveLength(2)
        expect(result[0]).toEqual(robert)
        expect(result[1]).toEqual(sally)
      })

      it('removes middle item', () => {
        const result = remove([jim, robert, sally], 1)
        expect(result).toHaveLength(2)
        expect(result[0]).toEqual(jim)
        expect(result[1]).toEqual(sally)
      })

      it('removes end item', () => {
        const result = remove([jim, robert, sally], 2)
        expect(result).toHaveLength(2)
        expect(result[0]).toEqual(jim)
        expect(result[1]).toEqual(robert)
      })
    })

    describe('update', () => {
      it('returns empty array if input empty', () => {
        const result = update([], 0, putNameInQuotes)
        expect(result).toHaveLength(0)
      })

      it('does nothing if index negative', () => {
        const result = update([robert], -1, putNameInQuotes)
        expect(result).toHaveLength(1)
        expect(result).toContainEqual(robert)
      })

      it('does nothing if index too high', () => {
        const result = update([robert], 1, putNameInQuotes)
        expect(result).toHaveLength(1)
        expect(result).toContainEqual(robert)
      })

      it('updates correct item', () => {
        const result = update([jim, robert, sally], 1, putNameInQuotes)
        expect(result).toHaveLength(3)
        expect(result[0]).toEqual(jim)
        expect(result[1]).toEqual({
          ...robert,
          name: '"Robert"',
        })
        expect(result[2]).toEqual(sally)
      })
    })
  })
})
