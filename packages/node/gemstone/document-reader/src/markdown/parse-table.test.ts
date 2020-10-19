import fs from 'fs'
import path from 'path'

import { mapValues } from 'lodash/fp'

import { ContentBlock, Document, Section } from '../types'

import { parseMarkdownDocument } from './parse-markdown-document'

const readFixture = (fixtureName: string) => {
  return fs.readFileSync(path.resolve(__dirname, '__fixtures__', 'tables', fixtureName), 'utf8')
}

const doParse = (fixtureName: string) => {
  return parseMarkdownDocument(readFixture(fixtureName))
}

describe('markdown table parsing', () => {
  describe('section content', () => {
    let document: Document
    let section: Section
    
    beforeEach(async () => {
      document = await doParse('with-other-content.md')
      expect(document.sections.length).toBe(1)
      section = document.sections[0]
    })

    it('has correct HTML representation', () => {
      expect(section.getHtml()).toMatchSnapshot()
    })

    it('has correct plain text representation', () => {
      expect(section.getText()).toMatchSnapshot()
    })
  })

  describe('with no other content', () => {
    let document: Document
    let section: Section
    
    beforeEach(async () => {
      document = await doParse('with-no-other-content.md')
      expect(document.sections.length).toBe(1)
      section = document.sections[0]
    })

    it('parses table', () => {
      expect(section.tables.length).toBe(1)
    })

    it('has correct number of rows', () => {
      const table = section.tables[0]
      expect(table.rows).toBe(2)
    })

    it('has correct column names', () => {
      const table = section.tables[0]
      expect(table.columnNames).toStrictEqual([
        'Column A',
        'B',
        'Last',
      ])
    })

    it('has correct HTML representation', () => {
      const table = section.tables[0]
      expect(table.getHtml()).toMatchSnapshot()
    })

    it('has correct plain text representation', () => {
      const table = section.tables[0]
      expect(table.getText()).toMatchSnapshot()
    })

    it.each<[number, Record<string, string>]>([
      [0, { 'Column A': 'Two bold words', 'B': '2', 'Last': 'Lorem' }],
      [1, { 'Column A': 'Row 2', 'B': '4', 'Last': 'Ipsum' }],
    ])('has correct data in row: %p', (row, expectedData) => {
      const table = section.tables[0]
      expect(table.data[row]).toStrictEqual(expectedData)
    })

    it.each<[number]>([
      [0],
      [1],
    ])('has correct cell contents in row: %p', (row) => {
      const table = section.tables[0]
      const dataAsHtml = mapValues((block: ContentBlock) => block.getHtml())(table.rowContent[row])
      expect(dataAsHtml).toMatchSnapshot()
    })
  })
})