import { buildMovementMode } from '../rules'

export const MovementModes = {
  Cautious: buildMovementMode({
    multiplier: 0.1,
    name: 'Cautious',
  }),
  Crawl: buildMovementMode({
    id: 'crawl',
    multiplier: 0.1,
    name: 'Four Legs in the Morning',
  }),
  Hustle: buildMovementMode({
    name: 'Hustle',
  }),
  Run: buildMovementMode({
    multiplier: 2,
    name: 'Run',
  }),
  Walk: buildMovementMode({
    id: 'walk',
    name: 'Two Legs in the Afternoon',
  }),
  WithCane: buildMovementMode({
    id: 'with-cane',
    multiplier: 0.5,
    name: 'Three Legs in the Evening',
  }),
}
