import { CharacterId } from '../../character'
import { createParameterSelector } from '../../common'
import { SceneStateContainer } from '../state'

export interface SceneSelectorParameters {
  characterId?: CharacterId
}

export const getCharacterIdParam = createParameterSelector((params: SceneSelectorParameters) => params.characterId)

/** scene selectors */
export const getScene = (state: SceneStateContainer) => state.scene ?? { }
