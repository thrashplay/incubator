import { RulesBuilder } from '../rules'

const { newMovementMode } = RulesBuilder

export const MovementModes = {
  Crawl: newMovementMode('Four Legs in the Morning', 0.1, 'crawl'),
  Walk: newMovementMode('Two Legs in the Afternoon', 1, 'walk'),
  WithCane: newMovementMode('Three Legs in the Evening', 0.5, 'with-cane'),
}
