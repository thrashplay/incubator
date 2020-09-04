import { get } from 'lodash'

import mapData from './map-data'

const { terrainTypes } = mapData

export class TerrainTypes {
  public findByKey (key: string) {
    return get(terrainTypes, key)
  }
}
