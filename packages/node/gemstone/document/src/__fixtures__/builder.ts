import { BaseDocumentNode, DocumentNode, DocumentNodeType, HeadingNode, SectionNode } from '../types'

export const createContent = () => ({
  getText: () => 'Test Content Object',
})

export const createNode = <TType extends DocumentNodeType, TProps extends {}>(
  type: TType, 
  extraProps: TProps,
  children: DocumentNode[] = [], 
): BaseDocumentNode & { type: TType } & TProps  => ({
  ...extraProps,
  children,
  content: createContent(),
  type,
})

export const createHeading = (level: number): HeadingNode => createNode('heading', {
  level,
})

export const createSection = (level: number, title: string | undefined = undefined, children: DocumentNode[] = []): SectionNode => { 
  const heading = title ? createHeading(level) : undefined
  return createNode(
    'section',
    {
      heading,
      level,
      tables: [],
      title,
    },
    heading ? [heading, ...children] : children,
  )
}

