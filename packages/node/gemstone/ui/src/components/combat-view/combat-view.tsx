import React, { useCallback, useEffect, useReducer } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Actor, getActors } from '@thrashplay/gemstone-model'
import { useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'
import { Extents } from '@thrashplay/math'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { LayoutStyles } from '../layout-styles'

import { ActorInspectPanel } from './actor-inspect-panel'
import { ActorList } from './actor-list'
import { CombatMap } from './combat-map'
import { CombatViewEvents } from './events'
import { reducer } from './reducer'
import { DEFAULT_EXTENTS, INITIAL_STATE } from './state'

export interface CombatViewProps extends WithViewStyles<'style'> {
  /** extents for the map view, defaults to [0, 0]-[500, 500] */
  extents?: Extents
}

/** Composite view for Combat Mode, including the sidebar and map elements. */
export const CombatView = ({
  extents: initialExtents,
  style,
}: CombatViewProps) => {
  const frameQuery = useFrameQuery()
  const actors = useValue(getActors, frameQuery)

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const { selectedActorId } = state

  useEffect(() => {
    dispatch(CombatViewEvents.extentsChanged(initialExtents ?? DEFAULT_EXTENTS))
  }, [dispatch, initialExtents])

  const handleSelectActor = useCallback((actorId: Actor['id']) => {
    dispatch(CombatViewEvents.actorSelected(actorId))
  }, [dispatch])

  return (
    <View style={[styles.container, style]}>
      <View style={styles.sidebar}>
        <ActorList
          actors={actors}
          onSelect={handleSelectActor}
          style={styles.actorList}
          title="Combatants"
        />
        {selectedActorId && (
          <ActorInspectPanel
            actorId={selectedActorId}
            style={styles.inspectPanel}
          />
        )}
      </View>

      <CombatMap
        dispatch={dispatch}
        style={styles.mapView}
        {...state}
      />
    </View>
  )
}

const actorList: ViewStyle = {
  borderColor: '#999',
  borderStyle: 'solid',
  borderWidth: 1,
  flexBasis: 0,
  flexGrow: 3,
}

const inspectPanel: ViewStyle = {
  borderColor: '#999',
  borderStyle: 'solid',
  borderWidth: 1,
  flexGrow: 1,
  marginTop: 8,
}

const styles = {
  ...LayoutStyles,
  ...StyleSheet.create({
    actorList,
    inspectPanel,
  }),
}
