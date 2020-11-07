import React from 'react'
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import { Area, getArea, getAreaDimensions, getAreaType } from '@thrashplay/gemstone-map-model'
import { useValue } from '@thrashplay/gemstone-ui-core'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { InspectPanelStyles } from '../../styles'
import { AttributeRow, AttributeRowProps } from '../attribute-row'

export interface AreaInspectPanelProps extends WithViewStyles<'style'> {
  /** the ID of the area to inspect */
  areaId?: Area['id']
}

export const AreaInspectPanel = ({
  areaId,
  style,
}: AreaInspectPanelProps) => {
  const area = useValue(getArea, { areaId })

  const renderContent = () => {
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
      <>
        <View style={styles.content}>
          <ScrollView>
            {createAttributeRow('Type', getAreaType)}
            {createAttributeRow('Dimensions', getAreaDimensions)}
          </ScrollView>
        </View>
      </>
    )
  }

  return area === undefined ? null : (
    <View style={style}>
      <Text style={styles.title}>{`Area ${area.id}`}</Text>
      {area && renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  ...InspectPanelStyles,
})
