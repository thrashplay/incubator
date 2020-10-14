import { clamp } from 'lodash'

export type AbilityCalculation = () => number
export type AbilityBonusCalculation = (abilityScore: AbilityCalculation) => number

// ability score helpers

// enforces an ability score range by clamping the decorated score to the specified
// range, which is inclusive
export const clampAbilityScore = (min: number, max: number) => (abilityScore: AbilityCalculation) => {
  return clamp(abilityScore(), min, max)
}