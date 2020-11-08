import { filter, find, isUndefined, negate, values } from 'lodash/fp'
import { createSelector } from 'reselect'

import { createParameterSelector } from '@thrashplay/gemstone-model'
import { calculateDistance, Point, rectangleContains } from '@thrashplay/math'

import { buildMap } from './builders/map-data'
import { Area, MapStateContainer, Thing } from './state'
import {
  isHorizontalWall as isHorizontalWallPredicate,
  isVerticalWall as isVerticalWallPredicate,
  isWall,
} from './things/predicates'
import { Wall } from './things/wall'

export interface MapSelectorParameters {
  /** ID of a specific Area instance to query */
  areaId?: Area['id']

  /** position to use for spatial selectors */
  position?: Point

  /** ID of a specific Thing instance to query */
  thingId?: Thing['id']
}

const getAreaIdParam = createParameterSelector((params?: MapSelectorParameters) => params?.areaId)
const getThingIdParam = createParameterSelector((params?: MapSelectorParameters) => params?.thingId)
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

/** Selects a thing by ID */
export const getThing = createSelector(
  [getThingCollection, getThingIdParam],
  (things, id) => id === undefined ? undefined : things[id]
)

/** Determines if a thing ID represents a horizontal wall */
export const isHorizontalWall = createSelector(
  [getThing],
  (thing) => isHorizontalWallPredicate(thing)
)

/** Determines if a thing ID represents a vertical wall */
export const isVerticalWall = createSelector(
  [getThing],
  (thing) => isVerticalWallPredicate(thing)
)

/**
 * Selects the extents representing the physical boundaries of a thing.
 *
 * NOTE: Currently, this only works for horizontal and vertical walls. Any other thing
 * will return undefined.
 **/
export const getThingBounds = createSelector(
  [getThing, isVerticalWall, isHorizontalWall],
  (thing, isVerticalWall, isHorizontalWall) => {
    const createVerticalBounds = () => {
      const { p1: start, p2: end, thickness } = thing as Wall

      return {
        x: Math.min(start.x, end.x) - (thickness / 2),
        y: Math.min(start.y, end.y),
        width: thickness,
        height: Math.abs(end.y - start.y),
      }
    }

    const createHorizontalBounds = () => {
      const { p1: start, p2: end, thickness } = thing as Wall

      return {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y) - (thickness / 2),
        width: Math.abs(start.x - end.x),
        height: thickness,
      }
    }

    return isVerticalWall
      ? createVerticalBounds()
      : isHorizontalWall
        ? createHorizontalBounds()
        : undefined
  }
)

export const getWall = createSelector(
  [getThing],
  (thing) => isWall(thing) ? thing : undefined
)

export const getWallLength = createSelector(
  [getWall],
  (wall) => wall === undefined ? 0 : calculateDistance(wall.p1, wall.p2)
)
