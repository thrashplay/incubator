// a section of rules text, including a title and content, as well as
// references to any child sections in the rules document
export interface RuleSectionContent {
  content?: string
  title: string
}

type RuleSectionContentRecord = Record<string, RuleSectionContent>

export type RuleSection =
  Omit<RuleSectionContentRecord, keyof RuleSectionContent> &
  RuleSectionContent

// creates an empty RulesSection with the given title; generally used
// to create the root content section with the name of a rules system
export const create = (title: string) => ({
  children: [],
  title,
})

// inserts content into an existing rules tree, specified by 'root'
// newContent is a valid, markdown-formatted section of rules content
// TODO: document the expected structure
export const addContent = (_root: RuleSection, _newContent: string) => {
  // TBD
}
