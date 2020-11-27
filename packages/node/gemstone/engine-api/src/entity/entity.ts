import { Dictionary } from '@thrashplay/gemstone-model'

export type AnyFacets = Dictionary<string, any>

type RequiredEntityFields = {
  /** ID of this entity. */
  id: string

  /** IDs of the facets that have been added to this entity. */
  facets: string[]
}

export type Entity<
  TFacets extends AnyFacets = AnyFacets
> = RequiredEntityFields & TFacets

export type MightBe<
  TPossibleFacets
> = RequiredEntityFields & Partial<TPossibleFacets>
