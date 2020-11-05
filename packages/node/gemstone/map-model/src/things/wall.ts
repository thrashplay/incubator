import { Thing } from '../state'

export interface Wall extends Thing {
  kind: 'wall'
  thickness: number
}
