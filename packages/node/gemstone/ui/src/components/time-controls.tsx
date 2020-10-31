import Slider from '@react-native-community/slider'
import { noop } from 'lodash/fp'
import React, { useCallback } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

import { SimulationCommands } from '@thrashplay/gemstone-engine'
import { getCurrentFrameNumber, getSegmentDuration, getTime } from '@thrashplay/gemstone-model'

import { useDispatch, useValue } from '../store'

export interface TimeControlsProps {
  /** callback notified when a new frame is selected */
  onSelectFrame?: (frameNumber: number) => void

  /** the number of the frame currently selected for display */
  selectedFrame?: number

  /** style to apply to the component's container */
  style?: StyleProp<ViewStyle>
}

export const TimeControls = ({
  onSelectFrame = noop,
  selectedFrame = 0,
  style,
}: TimeControlsProps) => {
  const dispatch = useDispatch()

  const currentTime = useValue(getTime)
  const frameNumber = useValue(getCurrentFrameNumber)
  const segmentDuration = useValue(getSegmentDuration)
  const selectedTime = useValue(getTime, { frameNumber: selectedFrame })

  const handleStepForward = useCallback(() => {
    dispatch(SimulationCommands.runSingleSegment())
    onSelectFrame(frameNumber + 1)
  }, [dispatch, frameNumber, onSelectFrame])

  const handleFastForward = useCallback(() => {
    dispatch(SimulationCommands.run())
    onSelectFrame(frameNumber + 1)
  }, [dispatch, frameNumber, onSelectFrame])

  const handleSelectPreviousFrame = useCallback(() => {
    if (selectedFrame > 0) {
      onSelectFrame(selectedFrame - 1)
    }
  }, [onSelectFrame, selectedFrame])

  const handleSelectNextFrame = useCallback(() => {
    if (selectedFrame < frameNumber) {
      onSelectFrame(selectedFrame + 1)
    }
  }, [frameNumber, onSelectFrame, selectedFrame])

  return (
    <View style={[styles.container, style]}>
      <Button
        mode="outlined"
        onPress={handleSelectPreviousFrame}
        style={styles.button}
      >
          &lt;
      </Button>

      <View style={styles.timeTextContainer}>
        <Text>{selectedTime}s</Text>
      </View>

      <Button
        mode="outlined"
        onPress={handleSelectNextFrame}
        style={styles.button}
      >
          &gt;
      </Button>

      <View style={styles.sliderContainer}>
        {currentTime > 0 && <Slider
          disabled={true}
          maximumValue={currentTime}
          minimumValue={0}
          step={segmentDuration}
          value={selectedTime}
        />}
      </View>

      <View style={styles.rightControls}>
        <Button
          mode="contained"
          onPress={handleStepForward}
          style={styles.button}
        >
            1
        </Button>
        <Button
          mode="contained"
          onPress={handleFastForward}
          style={styles.button}
        >
            &gt;&gt;&gt;
        </Button>

        <View style={styles.timeTextContainer}>
          <Text>{currentTime}s</Text>
        </View>
      </View>
    </View>
  )
}

const button: ViewStyle = {
  width: 24,
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
