import { Entity } from '../../entity'
import { World } from '../world'

export const advanceTime = (tickDuration: number) => (entity: Entity, numberOfTicks: number): Entity<World> => ({
  ...entity,
  time: (entity.time ?? 0) + (numberOfTicks * tickDuration),
})
