import { RulesBuilder } from '../rules'
import { newRules, setDefaultMovementMode } from '../rules/builders'

import { MovementModes } from './movement-modes'

const { addMovementMode, buildRules, newMovementMode } = RulesBuilder
const { Crawl, Walk, WithCane } = MovementModes

export const Rules = {
  Default: buildRules(
    addMovementMode(newMovementMode('Cautious', 0.1)),
    addMovementMode(newMovementMode('Hustle')),
    addMovementMode(newMovementMode('Run', 2)),
    setDefaultMovementMode('hustle')
  ),
  Empty: newRules(),
  RiddleOfTheSphinx: buildRules(
    addMovementMode(Crawl),
    addMovementMode(Walk),
    addMovementMode(WithCane),
    setDefaultMovementMode(Walk.id)
  ),
}
