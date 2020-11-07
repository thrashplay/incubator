import { ActorBodyCircles } from '../../map-elements/actor-body-circle'
import { ActorFirstInitialLabels } from '../../map-elements/actor-first-initial-label'

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
