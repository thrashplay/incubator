import Slider from '@react-native-community/slider'
import { noop } from 'lodash/fp'
import React, { useCallback } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Button } from 'react-native-paper'

import { SimulationCommands } from '@thrashplay/gemstone-engine'
import { getCurrentFrameNumber, getFrameNumber, getSegmentDuration, getTime } from '@thrashplay/gemstone-model'
import { WithViewStyles } from '@thrashplay/react-helpers'

import { useFrameQuery } from '../frame-context'
import { useDispatch, useValue } from '../store'

export interface TimeControlsProps extends WithViewStyles<'style'> {
  /** callback notified when a new frame is selected */
  onSelectFrame?: (frameNumber: number) => void
}

export const TimeControls = ({
  onSelectFrame = noop,
  style,
}: TimeControlsProps) => {
  const dispatch = useDispatch()

  const frameQuery = useFrameQuery()
  const currentFrameNumber = useValue(getCurrentFrameNumber)
  const currentTime = useValue(getTime)
  const selectedFrameNumber = useValue(getFrameNumber, frameQuery) ?? 0
  const selectedTime = useValue(getTime, frameQuery)
  const segmentDuration = useValue(getSegmentDuration)

  const handleStepForward = useCallback(() => {
    dispatch(SimulationCommands.runSingleSegment())
    onSelectFrame(currentFrameNumber + 1)
  }, [currentFrameNumber, dispatch, onSelectFrame])

  const handleFastForward = useCallback(() => {
    dispatch(SimulationCommands.run())
    onSelectFrame(currentFrameNumber + 1)
  }, [currentFrameNumber, dispatch, onSelectFrame])

  const handleSelectPreviousFrame = useCallback(() => {
    if (selectedFrameNumber > 0) {
      onSelectFrame(selectedFrameNumber - 1)
    }
  }, [onSelectFrame, selectedFrameNumber])

  const handleSelectNextFrame = useCallback(() => {
    if (selectedFrameNumber < currentFrameNumber) {
      onSelectFrame(selectedFrameNumber + 1)
    }
  }, [currentFrameNumber, onSelectFrame, selectedFrameNumber])

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
