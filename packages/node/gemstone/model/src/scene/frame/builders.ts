import { omit } from 'lodash/fp'

import { addItem, BuilderFunction, createBuilder, removeItem, updateItem } from '@thrashplay/fp'
import { Origin } from '@thrashplay/math'

import { Character, CharacterId } from '../../character'

import { ActorStatus, EMPTY_FRAME, Frame, IDLE_ACTION } from './state'

const DEFAULT_ACTION = IDLE_ACTION
const DEFAULT_POSITION = Origin

/** builder function for ActorStatus instances */
export const buildActorStatus = createBuilder((id: CharacterId) => ({
  action: DEFAULT_ACTION,
  id,
  position: DEFAULT_POSITION,
}))

const set = (values: Partial<ActorStatus>) => (initial: ActorStatus) => ({ ...initial, ...values })
const setPosition = (x: number, y: number) => set({ position: { x, y } })

export const ActorStatusBuilder = {
  set,
  setPosition,
}

/** builder function for Actor instances */
export type RequiredActorValues = { character: Character; status: ActorStatus }
export const buildActor = createBuilder(({ character, status }: RequiredActorValues) => ({
  ...character,
  status: omit('id')(status),
}))

/** builder function for Frame instances */
export const buildFrame = createBuilder(() => EMPTY_FRAME)

const setOnFrame = (values: Partial<Frame>) => (initial: Frame) => ({ ...initial, ...values })
const addActor = (actor: ActorStatus) => (frame: Frame) => ({ ...frame, actors: addItem(frame.actors, actor) })
const removeActor = (id: ActorStatus['id']) => (frame: Frame) => ({ ...frame, actors: removeItem(frame.actors, id) })
const updateActor = (
  id: ActorStatus['id'],
  ...updaters: BuilderFunction<ActorStatus>[]
) => (frame: Frame) => ({
  ...frame,
  actors: updateItem(frame.actors, id, ...updaters),
})

export const FrameBuilder = {
  addActor,
  removeActor,
  set: setOnFrame,
  updateActor,
}
