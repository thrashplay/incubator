import { buildRules, RuleSetBuilder } from '../rules'

import { MovementModes } from './movement-modes'

const { addMovementMode, setDefaultMovementMode } = RuleSetBuilder
const { Cautious, Crawl, Hustle, Run, Walk, WithCane } = MovementModes

export const Rules = {
  Default: buildRules(
    addMovementMode(Cautious),
    addMovementMode(Hustle),
    addMovementMode(Run),
    setDefaultMovementMode(Hustle.id)
  ),
  Empty: buildRules(),
  RiddleOfTheSphinx: buildRules(
    addMovementMode(Crawl),
    addMovementMode(Walk),
    addMovementMode(Run),
    addMovementMode(WithCane),
    setDefaultMovementMode(Walk.id)
  ),
}
