import { castArray, drop, find, head } from 'lodash/fp'
import { flow, get } from 'lodash/fp'

import { DocumentNode, SectionNode } from '../types'

import { isSectionWithTitle } from './predicates'
import { QueryRoot, SectionQueryRoot } from './types'

const getSearchRoot = (root: QueryRoot): DocumentNode => get('root')(root) ?? root

/**
 * Starting from a root document or section, find the section with a given path.
 * @param nameOrPath list of section titles to traverse while looking for the specified section
 */
const getSection = (nameOrPath: string | string[]) => (root: SectionQueryRoot): SectionNode | undefined => {
  const getSectionRecursive = (path: string[]) => (root: SectionNode): SectionNode | undefined => {
    const splitPath = (path: string[]): [string | undefined, string[]] => [head(path), drop(1)(path)]
  
    const [nextName, remainingPath] = splitPath(castArray(path))
    if (nextName === undefined) {
      return root
    }
  
    const nextSection = find<SectionNode>(isSectionWithTitle(nextName))(root.children)
    return nextSection === undefined ? undefined : getSectionRecursive(remainingPath)(nextSection)
  }

  return flow(
    Q.root,
    getSectionRecursive(castArray(nameOrPath)),
  )(root)
}

/** retrieves the immediate children of a query root */
const getChildNodes = (root: QueryRoot) => flow(
  Q.root,
  get('children'),
)(root) ?? []

export const Q = {
  childNodes: getChildNodes,
  root: getSearchRoot,
  section: getSection,
}