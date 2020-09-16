import React, { useCallback, useEffect, useState } from 'react'

import Storybook from '@thrashplay/sophia-storybook'
import { App } from '@thrashplay/sophia-ui'

const Root = () => {
  const [storybookActive, setStorybookActive] = useState(false)
  const toggleStorybook = useCallback(
    () => setStorybookActive(active => !active),
    []
  )

  useEffect(() => {
    if (__DEV__) {
      const DevMenu = require('react-native-dev-menu')
      DevMenu.addItem('Toggle Storybook', toggleStorybook)
    }
  }, [toggleStorybook])

  return storybookActive ? <Storybook /> : <App />
}

export default Root
