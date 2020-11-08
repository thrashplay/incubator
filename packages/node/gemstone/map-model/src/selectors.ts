import { filter, find, isUndefined, negate, values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { createParameterSelector } from '@thrashplay/gemstone-model'
import { Point, rectangleContains } from '@thrashplay/math'

import { buildMap } from './builders/map-data'
import { Area, MapStateContainer, Thing } from './state'

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
export const getAreaCollection = createSelector(
  [getMapData],
  (mapData) => mapData.areas
)

/** Selects an array containing all map areas. */
export const getAreas = createSelector(
  [getAreaCollection],
  (areas) => filter<Area>(negate(isUndefined))(values(areas))
)

/** Selects the area with the ID specified by the areaId parameter */
export const getArea = createSelector(
  [getAreaCollection, getAreaIdParam],
  (areas, id) => id === undefined
    ? undefined
    : areas[id]
)

/** Selects the bounds of an area w */
export const getAreaBounds = createSelector(
  [getAreaCollection, getAreaIdParam],
  (areas, id) => id === undefined
    ? { x: 0, y: 0, width: 0, height: 0 }
    : areas[id].bounds
)

/** Calculates a basic text description of the size and shape of this area. */
export const getBasicAreaDescription = createSelector(
  [getArea],
  (area) => area === undefined
    ? 'an unknown area'
    : `${area.bounds.width}' x ${area.bounds.height}' room`
)

export const getAreaType = createSelector(
  [getArea],
  (area) => 'unknown'
)

export const getAreaDimensions = createSelector(
  [getArea],
  (area) => area === undefined ? 'unknown' : `${area.bounds.width}' x ${area.bounds.height}'`
)

/**
 * Selects the area at the coordinates given in the position parameter.
 * If multiple areas are found at that location, one of them will be selected in a non-deterministic way.
 *
 * TODO: make handling multiple areas work better
 */
export const getAreaAtPosition = createSelector(
  [getAreaCollection, getPositionParam],
  (areas, position) => position === undefined
    ? undefined
    : find((area: Area) => rectangleContains(area.bounds, position))(areas)
)

/** things -------- */

/** Selects the Dictionary containing all things in a  map. */
export const getThingCollection = createSelector(
  [getMapData],
  (mapData) => mapData.things
)

/** Selects an array containing all things in a map. */
export const getThings = createSelector(
  [getThingCollection],
  (things) => filter<Thing>(negate(isUndefined))(values(things))
)
