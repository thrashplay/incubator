import { flow } from 'lodash/fp'

import { CharacterRecordsBuilder } from '../character'
import { Scene, SceneStateContainer } from '../scene'
import { buildScene, SceneBuilder } from '../scene/builders'
import { FrameBuilder } from '../scene/frame/builders'

import { CharacterRecords } from './character-records'
import { Characters } from './characters'
import { Frames } from './frames'
import { Rules } from './rules'

const { set } = FrameBuilder
const { addCharacter, addFrame, updateFrame } = SceneBuilder

const baseScene = buildScene(
  addCharacter('gimli'),
  addCharacter('treestump'),
  addCharacter('trogdor')
)

export const Scenes: { [k: string]: Scene } = {
  CharactersInFirstFrame: baseScene,

  Default: buildScene(),

  FiveIdleFrames: flow(
    updateFrame(0, set(Frames.AllIdle)),
    addFrame(Frames.AllIdle),
    addFrame(Frames.AllIdle),
    addFrame(Frames.AllIdle),
    addFrame(Frames.AllIdle)
  )(baseScene),

  IdleBeforeTypicalActions: flow(
    updateFrame(0, set(Frames.AllIdle)),
    addFrame(Frames.TypicalActions)
  )(baseScene),

  SingleIdleFrame: flow(
    updateFrame(0, set(Frames.AllIdle))
  )(baseScene),

  SingleTypicalFrame: flow(
    updateFrame(0, set(Frames.TypicalActions))
  )(baseScene),

  WithGimliAndTreestumpInMelee: flow(
    updateFrame(0, set(Frames.WithGimliAndTreestumpInMelee))
  )(baseScene),

  WithGimliRunning: flow(
    updateFrame(0, set(Frames.WithGimliRunning))
  )(baseScene),
}

const DEFAULT_DEPENDENCIES = {
  rules: Rules.RiddleOfTheSphinx,
  characters: CharacterRecordsBuilder.addCharacter(Characters.Treestump)(CharacterRecords.WithGimliAndTrogdor),
} as const

export const forSceneSelector = (
  scene: Scene,
  dependencies = DEFAULT_DEPENDENCIES
): SceneStateContainer => ({
  ...dependencies,
  scene,
})
