import { CharacterId } from '../../character'
import { createParameterSelector } from '../../common'
import { SceneStateContainer } from '../state'

export interface SceneSelectorParameters {
  characterId?: CharacterId
  frameNumber?: number
}

export const getCharacterIdParam = createParameterSelector((params?: SceneSelectorParameters) => params?.characterId)
export const getFrameNumberParam = createParameterSelector((params?: SceneSelectorParameters) => params?.frameNumber)

export const getState = (state: SceneStateContainer) => state

/** scene selectors */
export const getScene = (state: SceneStateContainer) => state.scene ?? { }
