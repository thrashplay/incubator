import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import { Area } from '@thrashplay/gemstone-map-model'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { AttributeRow, AttributeRowProps } from '../attribute-row'

export interface MapAreaInspectPanelProps extends WithViewStyles<'style'> {
  /** the ID of the area to inspect */
  areaId: Area['id']
}

export const MapAreaInspectPanel = ({
  areaId,
  style,
}: MapAreaInspectPanelProps) => {
  const createAttributeRow = <TAttribute extends unknown = any>(
    name: string,
    selector: AttributeRowProps<TAttribute>['selector'],
    rest?: Partial<AttributeRowProps<TAttribute>>
  ) => (
    <AttributeRow
      key={name}
      name={name}
      selector={selector}
      selectorParams={{ areaId }}
      {...rest}
    />
  )

  return (
    <View style={style}>
      <Text style={styles.title}>Area #{areaId}</Text>
      <>
        <View style={styles.content}>
          {/* {createAttributeRow('Position', getPosition, { format: Format.point })}
          {createAttributeRow('Target', getTarget)}
          {createAttributeRow('Speed', getCurrentSpeed, { format: Format.distance })}
          {createAttributeRow('Reach', getReach, { format: Format.distance })}
          {createAttributeRow('In Range', getReachableTargets, { format: Format.actorList })}
          {createAttributeRow('Movement Mode', getActiveMovementMode, { format: Format.movementMode })} */}
        </View>
      </>
    </View>
  )
}

const content: ViewStyle = {
  padding: 16,
}

const firstRow: ViewStyle = {
  marginTop: 0,
}

const title: TextStyle = {
  backgroundColor: '#ccc',
  borderBottomColor: '#666',
  borderBottomWidth: 1,
  padding: 16,
}

const styles = StyleSheet.create({
  content,
  firstRow,
  title,
})
