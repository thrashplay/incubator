import fs from 'fs'
import path from 'path'

import { map } from 'lodash/fp'

import { Document, Section } from '../types'

import { parseMarkdownDocument } from './parse-markdown-document'

const readFixture = (fixtureName: string) => {
  return fs.readFileSync(path.resolve(__dirname, '__fixtures__', fixtureName), 'utf8')
}

const doParse = (fixtureName: string) => {
  return parseMarkdownDocument(readFixture(fixtureName))
}

describe('markdown document parsing', () => {
  describe('when there are no headings', () => {
    let document: Document
    
    beforeEach(async () => {
      document = await doParse('no-headings.md')
    })

    it('creates document with single section', () => {
      expect(document.sections.length).toEqual(1)
    })

    it('creates single section with correct title', () => {
      const section = document.sections[0]
      expect(section.title).toBeUndefined()
    })

    it('creates single section with correct body', () => {
      const expectedBody = 
`First section of test content.

Some more content, but we have no headings yet.

This is marked up, isn't that cool?`

      const section = document.sections[0]
      expect(section.getText()).toEqual(expectedBody)
    })

    it('creates single section with correct depth', () => {
      const section = document.sections[0]
      expect(section.depth).toEqual(1)
    })

    it('creates single section with correct text', () => {
      const section = document.sections[0]
      expect(section.getHtml()).toEqual(
        `<p>First section of test content.</p>
<p>Some more content, but we have no headings yet.</p>
<p>This is <em>marked up</em>, isn't that cool?</p>`,
      )
    })
  })

  describe('text extraction and markup removal', () => {
    let document: Document
    
    beforeEach(async () => {
      document = await doParse('inline-markup.md')
    })

    it('extracts titles without markup', () => {
      expect(document.sections[0].title).toBe('Section 1')
    })

    it('extracts body without markup', () => {
      expect(document.sections[0].body.getText()).toBe('Section 1 is boring.')
    })

    it('removes non-nested markup from titles', () => {
      expect(document.sections[1].title).toBe('Section 2 with some special text')
    })

    it('removes non-nested markup from body', () => {
      expect(document.sections[1].body.getText()).toBe('Now this section is more interesting')
    })

    it('removes nested markup from titles', () => {
      expect(document.sections[2].title).toBe('Section 3 with some nested text markup')
    })

    it('removes nested markup from body', () => {
      expect(document.sections[2].body.getText()).toBe('Wow, there is so much markup in this here section.')
    })

    describe('block element handling', () => {
      beforeEach(async () => {
        document = await doParse('block-elements.md')
      })

      it('correctly handles basic paragraphs', () => {
        expect(document.sections[0].body.getText()).toBe(
          `This is the first paragraph.

This is the second paragraph.`,
        )
      })

      it('correctly handles Newlines In Same Paragraph', () => {
        expect(document.sections[1].body.getText()).toBe(
          `This is the first paragraph. Still the first.

And we now return to complete sentences in the final paragraph.`,
        )
      })

      it('correctly handles Ending Lines with Spaces to Force Newlines', () => {
        expect(document.sections[2].body.getText()).toBe(
          `This is the first paragraph.

Just some spaces
to mark this this newline

This is the end.`,
        )
      })
    })
  })

  describe('with top level headings only', () => {
    let document: Document
    
    beforeEach(async () => {
      document = await doParse('top-level-headings-only.md')
    })

    it('creates document with three sections', () => {
      expect(document.sections.length).toEqual(3)
    })

    it.each<[number, string]>([
      [0, 'Section 1'],
      [1, 'Section 2 with some special text'],
      [2, 'Section 3 with some nested text markup'],
    ])('creates section with correct title: section %p', (index, expectedTitle) => {
      const section = document.sections[index]
      expect(section.title).toEqual(expectedTitle)
    })

    it.each<[number]>([
      [0],
      [1],
      [2],
    ])('creates section with correct depth: section %p', (index) => {
      const section = document.sections[index]
      expect(section.depth).toEqual(1)
    })

    it.each<[number, string]>([
      [0, '<h1>Section 1</h1>'],
      [1, '<h1>Section 2 with <em>some</em> <strong>special</strong> text</h1>'],
      [2, '<h1>Section 3 with <em>some <strong>nested</strong> text</em> markup</h1>'],
    ])('creates section with correct content: section %p', (index, expectedContent) => {
      const section = document.sections[index]
      expect(section.getHtml()).toBe(expectedContent)
    })
  })

  describe('nested sections', () => {
    describe('simple', () => {
      let document: Document
      
      beforeEach(async () => {
        document = await doParse('nested-sections.md')
      })

      it('creates document with seven sections', () => {
        expect(document.sections.length).toEqual(7)
      })

      it.each<[number, string]>([
        [0, 'Section 1'],
        [1, 'Section 1.1'],
        [2, 'Section 1.1.1'],
        [3, 'Section 1.2'],
        [4, 'Section 1.2.1'],
        [5, 'Section 2'],
        [6, 'Section 2.1'],
      ])('creates section with correct title: section %p', (index, expectedTitle) => {
        const section = document.sections[index]
        expect(section.title).toEqual(expectedTitle)
      })

      it.each<[number, number]>([
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 2],
        [4, 3],
        [5, 1],
        [6, 2],
      ])('creates section with correct depth: section %p', (index, expectedDepth) => {
        const section = document.sections[index]
        expect(section.depth).toEqual(expectedDepth)
      })

      it.each<[number, string[]]>([
        [0, ['Section 1.1', 'Section 1.2']],
        [1, ['Section 1.1.1']],
        [2, []],
        [3, ['Section 1.2.1']],
        [4, []],
        [5, ['Section 2.1']],
        [6, []],
      ])('creates section with correct children: section %p', (index, expectedChildren) => {
        const section = document.sections[index]
        const childTitles = map((section: Section) => section.title)(section.children)
        expect(childTitles).toStrictEqual(expectedChildren)
      })

      it.each<[number, string]>([
        [0, '<h1>Section 1</h1>'],
        [1, '<h2>Section 1.1</h2>'],
        [2, '<h3>Section 1.1.1</h3>'],
        [3, '<h2>Section 1.2</h2>'],
        [4, '<h3>Section 1.2.1</h3>'],
        [5, `<h1>Section 2</h1>
<p>Section 2's content.</p>`],
        [6, `<h2>Section 2.1</h2>
<p>Section 2.1's content</p>`],
      ])('creates section with correct content: section %p', (index, expectedContent) => {
        const section = document.sections[index]
        expect(section.getHtml()).toBe(expectedContent)
      })
    })

    describe('irregular', () => {
      let document: Document
      
      beforeEach(async () => {
        document = await doParse('nested-sections-irregular.md')
      })

      it('creates document with six sections', () => {
        expect(document.sections.length).toEqual(6)
      })

      it.each<[number, number]>([
        [0, 3],
        [1, 4],
        [2, 2],
        [3, 5],
        [4, 3],
        [5, 1],
      ])('creates section with correct depth: section %p', (index, expectedDepth) => {
        const section = document.sections[index]
        expect(section.depth).toEqual(expectedDepth)
      })

      it.each<[number, string[]]>([
        [0, ['Second, h4']],
        [1, []],
        [2, ['Fourth, h5', 'Fifth, h3']],
        [3, []],
        [4, []],
        [5, []],
      ])('creates section with correct children: section %p', (index, expectedChildren) => {
        const section = document.sections[index]
        const childTitles = map((section: Section) => section.title)(section.children)
        expect(childTitles).toStrictEqual(expectedChildren)
      })

      it.each<[number, string]>([
        [0, '<h3>First, h3</h3>'],
        [1, '<h4>Second, h4</h4>'],
        [2, '<h2>Third, h2</h2>'],
        [3, '<h5>Fourth, h5</h5>'],
        [4, '<h3>Fifth, h3</h3>'],
        [5, '<h1>Sixth, h1</h1>'],
      ])('creates section with correct content: section %p', (index, expectedContent) => {
        const section = document.sections[index]
        expect(section.getHtml()).toBe(expectedContent)
      })
    })
  })
})

// describe('basic text and heading parsing', () => {
//   describe('simple input', () => {
//     const expectedResult: RulesContent = {
//       '/': {
//         children: [
//           '/Chapter I: Creating a Character',
//           '/Chapter II: Spells',
//         ],
//         title: 'OSRIC'
//       },
//       '/Chapter I: Creating a Character': {
//         children: [
//           '/Chapter I: Creating a Character/Ability Scores'
//         ],
//         parent: '/',
//         title: 'Chapter I: Creating a Character'
//       },
//       // '/Chapter I: Creating a Character/Ability Scores': {
//       //   children: [
//       //     '/Chapter I: Creating a Character/Ability Scores/Strength'
//       //   ],
//       //   content: 'This content describes ability scores in general.',
//       //   parent: '/Chapter I: Creating a Character',
//       //   title: 'Ability Scores'
//       // },
//       // '/Chapter I: Creating a Character/Ability Scores/Strength': {
//       //   children: [],
//       //   parent: '/Chapter I: Creating a Character/Ability Scores',
//       //   title: 'Strength'
//       // },
//       // '/Chapter II: Spells': {
//       //   children: [],
//       //   content: 'This is some stuff about spells.',
//       //   parent: '/',
//       //   title: 'Chapter II: Spells'
//       // },
//     }

//     it('parses correctly', () => {
//       expect(parseTextAndHeadings(getTestContent('basic.md'))).toEqual(expectedResult)
//     })
//   })
// })