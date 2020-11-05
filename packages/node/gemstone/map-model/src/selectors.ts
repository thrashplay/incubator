import { find } from 'lodash/fp'
import { createSelector } from 'reselect'

import { createParameterSelector } from '@thrashplay/gemstone-model'
import { Point, rectangleContains } from '@thrashplay/math'

import { buildMap } from './builders/map-data'
import { Area, MapStateContainer } from './state'

export interface MapSelectorParameters {
  /** ID of a specific Area instance to query */
  areaId?: Area['id']

  /** position to use for spatial selectors */
  position?: Point
}

const getAreaIdParam = createParameterSelector((params?: MapSelectorParameters) => params?.areaId)
const getPositionParam = createParameterSelector((params?: MapSelectorParameters) => params?.position)

/** map selectors */
export const getMapData = (state: MapStateContainer) => state.map ?? buildMap()

/** Selects the Dictionary containing all areas */
export const getAreacollection = createSelector(
  [getMapData],
  (mapData) => mapData.areas
)

/** Selects the area with the ID specified by the areaId parameter */
export const getArea = createSelector(
  [getAreacollection, getAreaIdParam],
  (areas, id) => id === undefined
    ? undefined
    : areas[id]
)

/**
 * Selects the area at the coordinates given in the position parameter.
 * If multiple areas are found at that location, one of them will be selected in a non-deterministic way.
 *
 * TODO: make handling multiple areas work better
 */
export const getAreaAtPosition = createSelector(
  [getAreacollection, getPositionParam],
  (areas, position) => position === undefined
    ? undefined
    : find((area: Area) => rectangleContains(area.bounds, position))(areas)
)
