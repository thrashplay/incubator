import React from 'react'
import { Image, View } from 'react-native'

export const HelloWorld = () => (
  <View>
    <Image source={require('./hello.jpg')} />
  </View>
)