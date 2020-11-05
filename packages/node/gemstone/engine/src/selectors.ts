import { MapSelectorParameters } from '@thrashplay/gemstone-map-model'
import {
  CharacterSelectorParameters,
  RulesSelectorParameters,
  SceneSelectorParameters,
} from '@thrashplay/gemstone-model'

export type SelectorParameters = CharacterSelectorParameters
& MapSelectorParameters
& RulesSelectorParameters
& SceneSelectorParameters
