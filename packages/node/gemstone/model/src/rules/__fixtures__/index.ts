export const MovementModeFixtures = {
  Crawl: {
    id: 'crawl',
    name: 'Four Legs in the Morning',
    multiplier: 0.1,
  },
  Walk: {
    id: 'walk',
    name: 'Two Legs in the Afternoon',
    multiplier: 1,
  },
  WithCane: {
    id: 'with-cane',
    name: 'Three Legs in the Evening',
    multiplier: 0.5,
  },
}

const baseRules = {
  meleeRange: 10,
  segmentDuration: 5,
}

export const RulesStateFixtures = {
  Default: {
    ...baseRules,
    movement: {
      defaultMode: 'hustle',
      modes: {
        cautious: {
          id: 'cautious',
          name: 'Cautious',
          multiplier: 0.1,
        },
        hustle: {
          id: 'hustle',
          name: 'Hustle',
          multiplier: 1,
        },
        run: {
          id: 'run',
          name: 'Run',
          multiplier: 2,
        },
      },
    },
  },
  RiddleOfTheSphinx: {
    ...baseRules,
    movement: {
      defaultMode: 'walk',
      modes: {
        crawl: MovementModeFixtures.Crawl,
        walk: MovementModeFixtures.Walk,
        'with-cane': MovementModeFixtures.WithCane,
      },
    },
  },
}
