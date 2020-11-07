import { find, matches } from 'lodash/fp'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { ViewEventDispatch } from '../dispatch-view-event'
import { AnimatedAvatar } from '../map-view/animated-avatar'
import { MapView } from '../map-view/map-view'
import { PanAndZoomOption } from '../map-view/pan-and-zoom-option'
import { ToolOption } from '../map-view/tool-option'

import { CombatViewEvent, CombatViewEvents } from './events'
import { ReachOverlay } from './overlays/reach'
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

  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)

  const SelectedTool = useMemo(() => {
    const option = find(
      matches({ id: selectedToolId })
    )(TOOL_OPTIONS) as ToolOption | undefined
    return option
  }, [selectedToolId])

  const handleToolSelected = useCallback((toolId: string) => {
    dispatch(CombatViewEvents.toolSelected(toolId))
  }, [dispatch])

  // const renderReachOverlay = useCallback((actor: Actor) => (
  //   <ReachOverlay key={actor.id}
  //     actorId={actor.id}
  //   />
  // ), [])

  return (
    <View style={[styles.container, style]}>
      <MapView
        extents={extents}
        onToolSelected={handleToolSelected}
        selectedToolId={selectedToolId}
        toolOptions={[PanAndZoomOption, ...TOOL_OPTIONS]}
      >
        {selectedActorId && (
          <AnimatedAvatar
            actorId={selectedActorId}
            selected={true}
          />)}
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
