import Slider from '@react-native-community/slider'
import React, { useCallback } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { IconButton } from 'react-native-paper'

import { SimulationCommands } from '@thrashplay/gemstone-engine'
import {
  getCurrentFrameNumber,
  getFrameNumber,
  getSegmentDuration,
  getTime,
  SceneEvents,
} from '@thrashplay/gemstone-model'
import { useDispatch, useFrameQuery, useValue } from '@thrashplay/gemstone-ui-core'
import { WithViewStyles } from '@thrashplay/react-helpers'

/** callback notified when a new frame is selected */
// onSelectFrame?: (frameNumber: number) => void

export type TimeControlsProps = WithViewStyles<'style'>

export const TimeControls = ({
  style,
}: TimeControlsProps) => {
  const dispatch = useDispatch()

  const frameQuery = useFrameQuery()
  const currentFrameNumber = useValue(getCurrentFrameNumber)
  const currentTime = useValue(getTime)
  const selectedFrameNumber = useValue(getFrameNumber, frameQuery) ?? 0
  const selectedTime = useValue(getTime, frameQuery)
  const segmentDuration = useValue(getSegmentDuration)

  const selectFrame = useCallback((frameNumber: number) => {
    dispatch(SceneEvents.frameTagged({
      frameNumber,
      tag: 'selected',
    }))
  }, [dispatch])

  const selectTime = useCallback((time: number) => {
    selectFrame(time / segmentDuration)
  }, [segmentDuration, selectFrame])

  const jumpToPresent = useCallback(() => {
    dispatch(SceneEvents.frameTagDeleted('selected'))
  }, [dispatch])

  const stepForward = useCallback(() => {
    dispatch(SimulationCommands.runSingleSegment())
    selectFrame(currentFrameNumber + 1)
  }, [currentFrameNumber, dispatch, selectFrame])

  const fastForward = useCallback(() => {
    dispatch(SimulationCommands.run())
    jumpToPresent()
  }, [dispatch, jumpToPresent])

  const truncate = useCallback(() => {
    dispatch(SceneEvents.truncated(selectedFrameNumber))
  }, [dispatch, selectedFrameNumber])

  const selectPreviousFrame = useCallback(() => {
    if (selectedFrameNumber > 0) {
      selectFrame(selectedFrameNumber - 1)
    }
  }, [selectFrame, selectedFrameNumber])

  const selectNextFrame = useCallback(() => {
    if (selectedFrameNumber < currentFrameNumber) {
      selectFrame(selectedFrameNumber + 1)
    }
  }, [currentFrameNumber, selectFrame, selectedFrameNumber])

  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon="step-backward"
        onPress={selectPreviousFrame}
        style={styles.button}
      />

      <View style={styles.timeTextContainer}>
        <Text>{selectedTime}s</Text>
      </View>

      <IconButton
        icon="step-forward"
        onPress={selectNextFrame}
        style={styles.button}
      />

      <View style={styles.sliderContainer}>
        {currentTime > 0 && <Slider
          disabled={true}
          maximumValue={currentTime}
          minimumValue={0}
          onValueChange={selectTime}
          step={segmentDuration}
          value={selectedTime}
        />}
      </View>

      <View style={styles.rightControls}>
        <IconButton
          color="red"
          icon="delete"
          onPress={truncate}
          style={styles.button}
        />

        <IconButton
          icon="play"
          onPress={stepForward}
          style={styles.button}
        />

        <IconButton
          icon="fast-forward"
          onPress={fastForward}
          style={styles.button}
        />

        <View style={styles.timeTextContainer}>
          <Text>{currentTime}s</Text>
        </View>
      </View>
    </View>
  )
}

const button: ViewStyle = {
  marginLeft: 4,
  marginRight: 4,
}

const container: ViewStyle = {
  alignItems: 'center',
  backgroundColor: '#eee',
  display: 'flex',
  flexDirection: 'row',
  padding: 8,
}

const rightControls: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'flex-end',
}

const sliderContainer: ViewStyle = {
  flexGrow: 1,
  marginLeft: 16,
  marginRight: 16,
}

const timeTextContainer: ViewStyle = {
  marginLeft: 12,
  marginRight: 12,
}

const styles = StyleSheet.create({
  button,
  container,
  rightControls,
  sliderContainer,
  timeTextContainer,
})
