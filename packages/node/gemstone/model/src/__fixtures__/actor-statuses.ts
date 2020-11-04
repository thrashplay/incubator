import { ActorStatusBuilder, buildActorStatus } from '../scene/frame/builders'

import { Actions } from './actions'
import { Characters } from './characters'

const { set } = ActorStatusBuilder
const { Gimli, Treestump, Trogdor } = Characters

export const ActorStatuses = {
  Gimli: {
    BefriendingElves: buildActorStatus(
      Gimli.id,
      set({ action: Actions.BefriendingElves, position: { x: 100, y: 100 } })
    ),
  },
  Treestump: {
    Grumbling: buildActorStatus(
      Treestump.id,
      set({ action: Actions.Grumbling, position: { x: 200, y: 50 } })
    ),
  },
  Trogdor: {
    Burninating: buildActorStatus(
      Trogdor.id,
      set({ action: Actions.Burninating, position: { x: 5, y: 5 } })
    ),
  },
}
