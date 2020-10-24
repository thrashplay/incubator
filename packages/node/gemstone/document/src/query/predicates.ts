import { matches } from 'lodash/fp'

import { SectionNode } from '../types'

export const NO_PROPS = {} as const

/** returns a predicate iteratee for finding section nodes matching the given props */
export const isMatchingSection = (matchingProps: Partial<SectionNode> = {}) => matches({
  ...matchingProps,
  type: 'section',
})

/** returns a predicate iteratee for finding section nodes in a list of DocumentNodes */
export const isSection = isMatchingSection(NO_PROPS)

/** returns a predicate iteratee for finding section nodes with a given title */
export const isSectionWithTitle = (title: string) => isMatchingSection({ title })