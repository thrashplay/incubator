import { Area } from '@thrashplay/gemstone-map-model'
import { Actor, Dictionary } from '@thrashplay/gemstone-model'

export type ActorDecoratorProps = { actorId: Actor['id'] }
export type MapAreaDecoratorProps = { areaId: Area['id'] }

export type DecoratorFunction = () => JSX.Element
export type ActorDecoratorFunction = (props: ActorDecoratorProps) => JSX.Element
export type MapAreaDecoratorFunction = (props: MapAreaDecoratorProps) => JSX.Element

export type ActorDecoratorMap = Dictionary<Actor['id'], ActorDecoratorFunction[]>
export type MapAreaDecoratorMap = Dictionary<Area['id'], MapAreaDecoratorFunction[]>

export const NO_DECORATORS = [] as const
export const getNoDecorators = () => NO_DECORATORS
