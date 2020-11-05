import { find, flow, get, map, matches } from 'lodash/fp'
import React, { useCallback, useMemo, useReducer } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { CommonPathProps, Rect, Svg } from 'react-native-svg'

import { Canvas, ContentViewProps } from '@thrashplay/canvas-with-tools'
import { Area, getArea } from '@thrashplay/gemstone-map-model'
import { AreaShape, AreasRenderer, Grid } from '@thrashplay/gemstone-map-ui'
import { Actor } from '@thrashplay/gemstone-model'
import { useValue, WithFrameQuery } from '@thrashplay/gemstone-ui-core'
import { Dimensions, Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'
import { ToolSelectorButtonBar } from '@thrashplay/tool-selector'

import { AvatarAnimation } from '../map-view/avatar-animation'
import { DefaultAvatar } from '../map-view/default-avatar'
import { MapView } from '../map-view/map-view'

import { INITIAL_STATE, reducer } from './state'
import { TOOL_OPTIONS } from './tools'

const DEFAULT_EXTENTS = {
  height: 500,
  width: 500,
  x: 0,
  y: 0,
}

export type MoveActionHandler = (x: number, y: number) => void

export interface CombatMapData {
  /** the actor currently selected */
  selectedActor?: Actor
}

export interface CombatMapProps extends CombatMapData, WithFrameQuery, WithViewStyles<'style'> {
  /** extents for the map view, defaults to [0, 0]-[1000, 1000] */
  extents?: Extents

  /** handler called when the user attempts to set a move action */
  onMove?: MoveActionHandler

  /** time offset, in seconds, of the frame being rendered */
  timeOffset: number
}

export const CombatMap = ({
  extents: initialExtents = DEFAULT_EXTENTS,
  style,
}: CombatMapProps) => {
  // zoom to full extents the when the map is first displayed
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (initialState) => ({
    ...initialState,
    extents: initialExtents,
  }))

  const bleh = Bleh
  return (
    <View style={[styles.container, style]}>
      <MapView
        data={need to supply this}
        overlay={Bleh}
        toolEventDispatch={dispatch}
        timeOffset={0}
        toolOptions={TOOL_OPTIONS}
      />
    </View>
  )
}

const Bleh = ({ data }: ContentViewProps<number>) => {
  const { selectedActor } = data
  return (
    <>
      {selectedActor &&
        <AvatarAnimation
          actorId={selectedActor.id}
          selected={true}
          timeOffset={0}
        />
      }
    </>
  )
}

const container: ViewStyle = {
  flexDirection: 'column',
}

const styles = StyleSheet.create({
  container,
})
