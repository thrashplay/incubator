import fs from 'fs'
import path from 'path'

import MarkdownIt from 'markdown-it'

describe('abilities', () => {
  describe('parsing', () => {
    it('parses', () => {
      const markdown = new MarkdownIt()
      const tokens = markdown.parse(fs.readFileSync(path.resolve(__dirname, 'tables', 'abilities.md'), 'utf8'), {})

      console.log('tokens', JSON.stringify(tokens, null, 2))
    })
  })
})