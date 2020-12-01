import { isFunction } from 'lodash'
import { get } from 'lodash/fp'
import { Either } from 'monet'

export const isEither = <L, R>(candidate: any): candidate is Either<L, R> => isFunction(get('isLeft', candidate))
