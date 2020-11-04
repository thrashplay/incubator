import { isEmpty } from 'lodash'
import { size } from 'lodash/fp'

import { add, addItem, BuilderFunction, createBuilder, remove, update } from '@thrashplay/fp'

import { Character } from '../character'
import { MonsterType } from '../monster'

import { Frame } from './frame/state'
import { ActorStatReference, EMPTY_SCENE, Scene, SINGLE_EMPTY_FRAME } from './state'

/** builder function for Scene instances */
export const buildScene = createBuilder(() => EMPTY_SCENE)

const addFrameIfNone = (frames: Frame[]): [Frame, ...Frame[]] =>
  isEmpty(frames)
    ? SINGLE_EMPTY_FRAME
    : frames as [Frame, ...Frame[]]

const addCharacter = (id: Character['id']) => (scene: Scene) => ({
  ...scene,
  actors: addItem(scene.actors, { id, type: 'pc' } as ActorStatReference),
})

const addMonster = (id: MonsterType['id']) => (scene: Scene) => ({
  ...scene,
  actors: addItem(scene.actors, { id, type: 'monster' } as ActorStatReference),
})

const addFrame = (frame: Frame) => (scene: Scene) => ({
  ...scene,
  frames: addFrameIfNone(add(scene.frames, frame)),
})

const removeFrame = (index: number) => (scene: Scene) => ({
  ...scene,
  frames: addFrameIfNone(remove(scene.frames, index)),
})

const updateFrame = (
  index: number,
  ...updaters: BuilderFunction<Frame>[]
) => (scene: Scene) => ({
  ...scene,
  frames: addFrameIfNone(update(scene.frames, index, ...updaters)),
})

const updateCurrentFrame = (
  ...updaters: BuilderFunction<Frame>[]
) => (scene: Scene) => updateFrame(size(scene.frames) - 1, ...updaters)(scene)

export const SceneBuilder = {
  addCharacter,
  addFrame,
  addMonster,
  removeFrame,
  updateCurrentFrame,
  updateFrame,
}
