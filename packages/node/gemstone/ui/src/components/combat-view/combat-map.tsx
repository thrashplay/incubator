import { find, matches } from 'lodash/fp'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { ActorBodyCircles } from '../../map-elements/actor-body-circle'
import { ViewEventDispatch } from '../dispatch-view-event'
import { MapView } from '../map-view/map-view'
import { PanAndZoomOption } from '../map-view/pan-and-zoom-option'
import { ToolOption } from '../map-view/tool-option'

import { CombatViewEvent, CombatViewEvents } from './events'
import { SelectionIndicator } from './overlays/selection-indicator'
import { CombatViewState } from './state'
import { TOOL_OPTIONS } from './tools'

export interface CombatMapProps extends CombatViewState, WithViewStyles<'style'> {
  /** dispatc function for sending view events */
  dispatch: ViewEventDispatch<CombatViewEvent>

  /** the ID of the selected actor, or undefined if none */
  selectedActorId?: Actor['id']
}

/** Component responsible for rendering combat-specific content on top of an area map. */
export const CombatMap = ({
  dispatch,
  style,
  ...props
}: CombatMapProps) => {
  const {
    extents,
    selectedActorId,
    selectedToolId,
  } = props

  const SelectedTool = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )(TOOL_OPTIONS) as ToolOption | undefined
    return option
  }, [selectedToolId])

  const handleToolSelected = useCallback((toolId: string) => {
    dispatch(CombatViewEvents.toolSelected(toolId))
  }, [dispatch])

  const getActorDecorators = useCallback((actorId: Actor['id']) => {
    return actorId === selectedActorId ? ActorBodyCircles.Selected : undefined
  }, [selectedActorId])

  return (
    <View style={[styles.container, style]}>
      <MapView
        getActorDecorators={getActorDecorators}
        extents={extents}
        onToolSelected={handleToolSelected}
        selectedToolId={selectedToolId}
        toolOptions={[PanAndZoomOption, ...TOOL_OPTIONS]}
      >
        {SelectedTool && <SelectedTool.component dispatchViewEvent={dispatch} viewState={props} />}
      </MapView>
    </View>
  )
}
const container: ViewStyle = {
}

const styles = StyleSheet.create({
  container,
})
