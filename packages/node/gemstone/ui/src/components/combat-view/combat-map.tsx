import { find, matches } from 'lodash/fp'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Actor } from '@thrashplay/gemstone-model'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { ActorBodyCircles, ActorFirstInitialLabels, ActorReachCircles, createMovementPreview } from '../actor-decorators'
import { ViewEventDispatch } from '../dispatch-view-event'
import { getNoDecorators } from '../map-view/decorators'
import { MapView } from '../map-view/map-view'
import { PanAndZoomOption } from '../map-view/pan-and-zoom-option'
import { ToolOption } from '../map-view/tool-option'

import { NonSelectedActorMovementPreview } from './decorators/non-selected-actor-movement-preview copy'
import { SelectedActorMovementPreview } from './decorators/selected-actor-movement-preview'
import { CombatViewEvent, CombatViewEvents } from './events'
import { CombatViewState } from './state'
import { TOOL_OPTIONS } from './tools'

export interface CombatMapProps extends CombatViewState, WithViewStyles<'style'> {
  /** dispatc function for sending view events */
  dispatch: ViewEventDispatch<CombatViewEvent>

  /** the ID of the selected actor, or undefined if none */
  selectedActorId?: Actor['id']
}

const SELECTED_ACTOR_DECORATORS = [
  ActorReachCircles.Default,
  SelectedActorMovementPreview,
  ActorBodyCircles.Selected,
  ActorFirstInitialLabels.Default,
]

const DEFAULT_ACTOR_DECORATORS = [
  ActorReachCircles.Default,
  NonSelectedActorMovementPreview,
  ActorBodyCircles.Default,
  ActorFirstInitialLabels.Default,
]

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
    return actorId === selectedActorId
      ? SELECTED_ACTOR_DECORATORS
      : DEFAULT_ACTOR_DECORATORS
  }, [selectedActorId])

  return (
    <View style={[styles.container, style]}>
      <MapView
        getActorDecorators={getActorDecorators}
        getDefaultActorDecorators={getNoDecorators}
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
