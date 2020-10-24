import { Chapters, Documents } from '../__fixtures__'

import { Q as section } from './section'

describe('section queries', () => {
  describe('children', () => {
    it('returns top-level child sections for a document', () => {
      expect(section.children(Documents.SectionsOnly)).toStrictEqual([
        expect.objectContaining({
          title: undefined,
          type: 'section',
        }),
        expect.objectContaining({
          title: 'Chapter 1',
          type: 'section',
        }),
        expect.objectContaining({
          title: 'Chapter 2',
          type: 'section',
        }),
      ])
    })

    it('returns next child sections for a section', () => {
      expect(section.children(Chapters.SectionsOnly.Chapter1)).toStrictEqual([
        expect.objectContaining({
          title: undefined,
          type: 'section',
        }),
        expect.objectContaining({
          title: 'Section 1.1',
          type: 'section',
        }),
        expect.objectContaining({
          title: 'Section 1.2',
          type: 'section',
        }),
        expect.objectContaining({
          title: 'Section 1.3',
          type: 'section',
        }),
      ])
    })
  })
})