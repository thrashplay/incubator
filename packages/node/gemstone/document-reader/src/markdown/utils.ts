import { castArray } from 'lodash/fp'
import { isString } from 'lodash/fp'
import MarkdownIt from 'markdown-it'
import htmlToText from 'html-to-text'

import { Token } from './types'

const markdown = new MarkdownIt()
const renderer = markdown.renderer

export const getText = (input: Token | Token[] | string): string => {
  const html = isString(input)
    ? input
    : renderer.render(castArray(input), {}, {})

  const htmlToTextOptions = {
    uppercaseHeadings: false,
    wordwrap: null,
  }

  return htmlToText.fromString(html, htmlToTextOptions)
}

export const tokenOfType = (type: string) => (token: Token) => token.type === type
