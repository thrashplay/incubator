import htmlToText from 'html-to-text'
import { isEmpty } from 'lodash/fp'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt()
const renderer = markdown.renderer

import { ContentBlock } from './types'

export const renderHtml = (content: ContentBlock) => {
  return isEmpty(content?.tokens) ? '' : renderer.render(content.tokens, {}, {})
}

export const renderText = (content: ContentBlock) => {
  const html = renderHtml(content)

  const htmlToTextOptions = {
    uppercaseHeadings: false,
    wordwrap: null,
  }

  return htmlToText.fromString(html, htmlToTextOptions)
}