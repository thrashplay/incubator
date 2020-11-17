import { Dictionary } from '@thrashplay/gemstone-model'

type RequiredEntityFields = {
  /** ID of this entity. */
  id: string

  /** Facets that have been added to this entity. */
  facets: string[]
}

export type Entity<
  TFacets extends Dictionary<string, any> = Dictionary<string, any>
> = RequiredEntityFields & TFacets

export type MightBe<
  TPossibleFacets
> = RequiredEntityFields & Partial<TPossibleFacets>
