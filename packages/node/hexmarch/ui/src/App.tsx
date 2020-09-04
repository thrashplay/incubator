import React, { Component } from 'react'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

import 'react-native-gesture-handler'

import { HexCoordinates } from '@thrashplay/hex-utils'
import { Map, World } from '@thrashplay/hexmarch-model'

import { WorldView } from './world'

// https://callstack.github.io/react-native-paper/theming.html
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

const world: World = {
  map: new Map('Test Map', 120),
  name: 'Test World',
}

const createTile = (q: number, r: number, terrain: string) => ({
  coordinates: new HexCoordinates(q, r),
  terrainType: {
    key: terrain,
    name: terrain,
  },
})

world.map.tiles.set([0, 0], createTile(0, 0, 'water'))
// world.map.tiles.set([-1, 1], createTile(-1, 1, 'mountain'))
// world.map.tiles.set([0, 1], createTile(0, 1, 'mountain'))
// world.map.tiles.set([1, 0], createTile(1, 0, 'grass'))

export class App extends Component {
  public render () {
    return (
      <PaperProvider theme={theme}>
        <WorldView world={world} />
      </PaperProvider>
    )
  }
}
