import fs from 'fs'
import path from 'path'

import { parseMarkdownDocument } from '@thrashplay/gemstone-document-reader'

describe('abilities', () => {
  describe('parsing', () => {
    it('parses', async () => {
      const rules = await parseMarkdownDocument(
        fs.readFileSync(path.resolve(__dirname, 'osric', 'abilities.md'), 'utf8')
      )
      expect(rules).toBeDefined()
    })
  })
})
