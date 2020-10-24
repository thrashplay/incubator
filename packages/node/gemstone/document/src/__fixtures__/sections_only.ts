import { Document, SectionNode } from '../types'

import { createNode, createSection } from './builder'

const root = createNode('root', {}, 
  [
    createSection(1), 
    createSection(1, 'Chapter 1', 
      [
        createSection(2),
        createSection(2, 'Section 1.1'),
        createSection(2, 'Section 1.2', 
          [
            createSection(3, 'Section 1.2.1'),
            createSection(3, 'Section 1.2.2'),
          ],
        ),
        createSection(2, 'Section 1.3'),
      ],
    ), 
    createSection(1, 'Chapter 2', 
      [
        createSection(2, 'Section 2.1'),
        createSection(2, 'Section 2.2'),
      ],
    ),
  ],
)

export const document: Document = {
  root,
}

export const chapters = {
  Chapter1: root.children[1],
  Chapter2: root.children[2],
} as Record<string, SectionNode>