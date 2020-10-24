import { size } from 'lodash/fp'

import { Chapters, Documents } from '../__fixtures__'

import { Q as document } from './document'

describe('document queries', () => {
  describe('section(Document)', () => {
    it('returns undefined, when top-level section does not exist', () => {
      const section = 'invalid-section-name'
      expect(document.section(section)(Documents.SectionsOnly)).toBeUndefined()
    })

    it('returns undefined, when section does not exist', () => {
      const section = ['Chapter 1', 'invalid-section-name']
      expect(document.section(section)(Documents.SectionsOnly)).toBeUndefined()
    })

    it.each<[string, string]>([
      ['Chapter 1', 'Chapter 1'],
      ['Chapter 2', 'Chapter 2'],
    ])('returns correct top-level section: %p', (_, name) => {
      expect(document.section(name)(Documents.SectionsOnly)).toMatchObject({
        level: 1,
        title: name,
        type: 'section',
      })
    })

    it.each<[string, string[]]>([
      ['Chapter 1', ['Chapter 1']],
      ['Section 1.1', ['Chapter 1', 'Section 1.1']],
      ['Section 1.2', ['Chapter 1', 'Section 1.2']],
      ['Section 1.2.1', ['Chapter 1', 'Section 1.2', 'Section 1.2.1']],
      ['Section 1.2.2', ['Chapter 1', 'Section 1.2', 'Section 1.2.2']],
      ['Section 1.3', ['Chapter 1', 'Section 1.3']],
      ['Chapter 2', ['Chapter 2']],
      ['Section 2.1', ['Chapter 2', 'Section 2.1']],
      ['Section 2.2', ['Chapter 2', 'Section 2.2']],
    ])('returns correct nested section: %p', (name, path) => {
      expect(document.section(path)(Documents.SectionsOnly)).toMatchObject({
        level: size(path),
        title: name,
        type: 'section',
      })
    })
  })

  describe('section(Section)', () => {
    it('returns undefined, when top-level subsection does not exist', () => {
      const section = 'invalid-section-name'
      expect(document.section(section)(Chapters.SectionsOnly.Chapter1)).toBeUndefined()
    })

    it('returns undefined, when subsection does not exist', () => {
      const section = ['Section 1.1', 'invalid-section-name']
      expect(document.section(section)(Chapters.SectionsOnly.Chapter1)).toBeUndefined()
    })

    it.each<[string, string]>([
      ['Section 1.1', 'Section 1.1'],
      ['Section 1.2', 'Section 1.2'],
      ['Section 1.3', 'Section 1.3'],
    ])('returns correct top-level subsection: %p', (_, name) => {
      expect(document.section(name)(Chapters.SectionsOnly.Chapter1)).toMatchObject({
        level: 2,
        title: name,
        type: 'section',
      })
    })

    it.each<[string, string[]]>([
      ['Section 1.2.1', ['Section 1.2', 'Section 1.2.1']],
      ['Section 1.2.2', ['Section 1.2', 'Section 1.2.2']],
    ])('returns correct nested subsection: %p', (name, path) => {
      expect(document.section(path)(Chapters.SectionsOnly.Chapter1)).toMatchObject({
        level: size(path) + 1,
        title: name,
        type: 'section',
      })
    })
  })

  describe('childNodes', () => {
    it('returns top-level children for a document', () => {
      expect(document.childNodes(Documents.SectionsOnly)).toStrictEqual([
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

    it('returns next children for a section', () => {
      expect(document.childNodes(Chapters.SectionsOnly.Chapter1)).toStrictEqual([
        expect.objectContaining({
          type: 'heading',
        }),
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