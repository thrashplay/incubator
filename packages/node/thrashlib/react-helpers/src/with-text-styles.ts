import { StyleProp, TextStyle } from 'react-native'

export type WithTextStyles<TStyle extends string> = {
  /** style to apply to the element with the specified type */
  [k in TStyle]?: StyleProp<TextStyle>
}
