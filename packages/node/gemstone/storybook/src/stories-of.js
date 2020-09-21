import { Platform } from 'react-native'

let storiesOf
if (Platform.OS === 'web') {
  storiesOf = require('@storybook/react').storiesOf
} else {
  storiesOf = require('@storybook/react-native').storiesOf
}

export { storiesOf }
