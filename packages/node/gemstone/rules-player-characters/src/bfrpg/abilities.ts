import { AbilityCalculation, clampAbilityScore } from '../abilities'

export const AbilityScoreNames = [
  'Charisma',
  'Constitution',
  'Dexterity',
  'Intelligence',
  'Strength',
  'Wisdom',
] as const
export type AbilityScoreName = typeof AbilityScoreNames[number]

export const MINIMUM_ABILITY_SCORE = 3
export const MAXIMUM_ABILITY_SCORE = 18

// ability calculation decorator to enforce the system ability score range
export const withValidRange = clampAbilityScore(MINIMUM_ABILITY_SCORE, MAXIMUM_ABILITY_SCORE)

export const calculateAbilityBonus = (abilityScore: AbilityCalculation) => {
  const score = abilityScore()
  switch (score) {
    case 3:
      return -3

    case 4:
    case 5:
      return -2

    case 6:
    case 7:
    case 8:
      return -1

    case 9:
    case 10:
    case 11:
    case 12:
      return 0

    case 13:
    case 14:
    case 15:
      return 1

    case 16:
    case 17:
      return 2

    case 18:
      return 3

    default:
      return score < 3
        ? -3
        : 3
  }
}
