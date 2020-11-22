import { Dictionary } from '@thrashplay/gemstone-model'

import { Entity } from '../entity'

/**
 * An Action represents an attempt by one Entity to change the state of another. The type of action indicates
 * the nature of the change being attempted, and different types will have different details to describe how
 * the action is performed -- it's intensity, effectiveness, nature, etc.
 *
 * Every action also has a 'source', which is the entity initiating the action, and a 'target', which is the
 * entity being acted upon.
 */
export type Action<
  TAction extends string = string,
  TDetails extends Dictionary<string, unknown> = never
> = {
  source: Entity['id']
  target: Entity['id']
  type: TAction
} & ([TDetails] extends [never] ? unknown : { details: TDetails })
