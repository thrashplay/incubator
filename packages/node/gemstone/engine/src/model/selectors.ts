import * as Character from './character/selectors'
import * as Rules from './rules/selectors'
import * as Scene from './scene/selectors'

export type SelectorParameters = Character.CharacterSelectorParameters
& Rules.RulesSelectorParameters
& Scene.SceneSelectorParameters
