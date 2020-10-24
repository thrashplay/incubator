import { get, has, isEmpty, size, trimStart } from "lodash";
import { find, head, map, replace, split } from "lodash/fp";
import { Document, Section } from "./types";

const EMPTY_CONTENT_BLOCK = {
  getHtml: () => '',
  getText: () => '',
}

const EMPTY_SECTION: Section = {
  ...EMPTY_CONTENT_BLOCK,
  body: EMPTY_CONTENT_BLOCK,
  children: [],
  depth: 0,
  tables: [],
}

export const getRootSection = (document: Document) => head(document.sections) ?? EMPTY_SECTION

export const getSection = (path?: string) => (source: Document | Section): Section | undefined => {
  const isDocument = (maybeDocument: any): maybeDocument is Document => has(maybeDocument, 'sections')

  const getChild = (sectionName: string) => (parent: Section) => {
    return find((section: Section) => section.title === sectionName)(parent.children ?? [])
  }

  const root = isDocument(source) ? getRootSection(source) : source
  const relativePath = trimStart(path, '/')
  const nextPart = head(split('/')(relativePath))

  if (isEmpty(relativePath) || nextPart === undefined) {
    return root
  } else {
    const child = getChild(nextPart)(root)
    return child === undefined ? undefined : getSection(replace(nextPart ?? '', '')(relativePath))(child)
  }
}