import { kebabCase } from 'lodash/fp'

/** converts a human-readable string to an ID derived from it */
export const toId = (name: string) => kebabCase(name)
