import { MapSelectorParameters } from '@thrashplay/gemstone-map-model'
import {
  CharacterSelectorParameters,
  RandomTablesSelectorParameters,
  RulesSelectorParameters,
  SceneSelectorParameters,
} from '@thrashplay/gemstone-model'

export type SelectorParameters = CharacterSelectorParameters
& MapSelectorParameters
& RandomTablesSelectorParameters
& RulesSelectorParameters
& SceneSelectorParameters
