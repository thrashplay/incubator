import { MapData } from '@thrashplay/gemstone-map-model'
import { CharacterRecordSet, RuleSet, Scene } from '@thrashplay/gemstone-model'

export interface GameState {
  characters: CharacterRecordSet
  map: MapData
  rules: RuleSet
  scene: Scene
}
