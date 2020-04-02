import crypto from 'crypto'

import { flow, snakeCase, toUpper, truncate } from 'lodash/fp'

import { VariableNameCreator, VersionGetter } from './types'

export const getVariableName: VariableNameCreator = (configEntry) => flow(
  snakeCase,
  toUpper,
  (id) => `${id}_VERSION`,
)(configEntry.id)

const generateSha256Hash = (content: string) => crypto.createHash('sha256').update(content).digest('hex')
export const getVersion: VersionGetter = (content) => flow(
  generateSha256Hash,
  truncate({ length: 8, omission: '' }),
)(content)