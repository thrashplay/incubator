import { flow } from 'lodash/fp'

import { ActorStatusBuilder, buildFrame, FrameBuilder } from '../scene/frame/builders'

import { Actions } from './actions'
import { ActorStatuses } from './actor-statuses'

const { Idle, Moving } = Actions
const { Gimli, Treestump, Trogdor } = ActorStatuses
const { addActor, updateActor } = FrameBuilder
const { set, setPosition } = ActorStatusBuilder

const defaultFrame = buildFrame(
  addActor(Gimli.BefriendingElves),
  addActor(Treestump.Grumbling),
  addActor(Trogdor.Burninating)
)

export const Frames = {
  AllIdle: flow(
    updateActor('gimli', set({ action: Idle })),
    updateActor('treestump', set({ action: Idle })),
    updateActor('trogdor', set({ action: Idle }))
  )(defaultFrame),

  Empty: buildFrame(),

  TypicalActions: defaultFrame,

  WithGimliAndTreestumpInMelee: flow(
    updateActor('gimli', setPosition(100, 100)),
    updateActor('treestump', setPosition(100, 114)),
    updateActor('trogdor', setPosition(100, 113))
  )(defaultFrame),

  WithGimliRunning: flow(
    updateActor('gimli', set({
      action: Moving,
      movementMode: 'run',
    }))
  )(defaultFrame),
}
