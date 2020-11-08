import { ActorBodyCircles } from './actor-body-circle'
import { ActorFirstInitialLabels } from './actor-first-initial-label'

export const ActorDecoratorSets = {
  Default: [
    ActorBodyCircles.Default,
    ActorFirstInitialLabels.Default,
  ],
  WithoutName: [
    ActorBodyCircles.Default,
  ],
}

export const getDefaultActorDecorators = () => ActorDecoratorSets.Default
