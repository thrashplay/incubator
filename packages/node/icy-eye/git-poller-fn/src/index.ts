import { Request } from 'express'

import { handler } from './handler'

export interface FaasContext {
  fail: (err: Error) => void
  headers: <TArgs extends [object] | []>(...args: TArgs) => TArgs extends [object] ? FaasContext : object
  status: <TArgs extends [number] | []>(...args: TArgs) => TArgs extends [number] ? FaasContext : number
  succeed: (result: any) => void
}

export interface FaasEvent<TBody extends Request['body'] = Request['body']> {
  body: TBody
  headers: Request['headers']
  method: Request['method']
  path: Request['path']
  query: Request['query']
}

type FaasHandler = (event: FaasEvent, context: FaasContext) => any
type FaasHandlerOptions = {}
export const createFaasHandler = (delegate: FaasHandler, options?: FaasHandlerOptions): FaasHandler => delegate

module.exports = createFaasHandler(handler)