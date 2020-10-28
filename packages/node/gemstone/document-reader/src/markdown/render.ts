import htmlToText from 'html-to-text'
import { isEmpty } from 'lodash/fp'
import MarkdownIt from 'markdown-it'

import { MarkdownContentBlock } from './types'

const markdown = new MarkdownIt()
const renderer = markdown.renderer

export const renderHtml = (content: MarkdownContentBlock) => {
  return isEmpty(content?.tokens) ? '' : renderer.render(content.tokens, {}, {}).trim()
}

export const renderText = (content: MarkdownContentBlock) => {
  const html = renderHtml(content)

  const htmlToTextOptions = {
    tables: true,
    uppercaseHeadings: false,
    wordwrap: null,
  }

  return htmlToText.fromString(html, htmlToTextOptions)
}

export const getHtmlRenderer = (content: MarkdownContentBlock) => renderHtml(content)
export const getTextRenderer = (content: MarkdownContentBlock) => renderText(content)

export const withRenderers = <
  TBase extends MarkdownContentBlock = any,
  T extends Omit<TBase, 'getHtml' | 'getText'> = any
>(content: T) => ({
  ...content,
  getHtml: function () {
    return renderHtml(this)
  },
  getText: function () {
    return renderText(this)
  },
})
