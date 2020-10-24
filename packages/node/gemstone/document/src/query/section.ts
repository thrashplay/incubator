import { filter, flow } from 'lodash/fp'

import { SectionNode } from '../types'

import { Q as document } from './document'
import { isSection } from './predicates'
import { SectionQueryRoot } from './types'

/** root of all section queries against a document: either the document itself, or a section node inside it */

/** retrieves the immediate child sections of a query root */
const getChildren = (root: SectionQueryRoot) => flow(
  document.childNodes,
  filter<SectionNode>(isSection),
)(root)

/** basic property selectors */
const getHeading = (section: SectionNode | undefined) => section?.heading
const getLevel = (section: SectionNode | undefined) => section?.level ?? 0
const getTables = (section: SectionNode | undefined) => section?.tables ?? []
const getTitle = (section: SectionNode | undefined) => section?.title

export const Q = {
  children: getChildren,
  heading: getHeading,
  level: getLevel,
  tables: getTables,
  title: getTitle,
}
