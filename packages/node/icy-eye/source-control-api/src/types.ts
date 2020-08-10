import { Params, ParamsDictionary, Request, Response } from 'express-serve-static-core'
import { Context } from 'openapi-backend'

/** type of the 'req' object passed to an openapi-backend operation handler */
export type OperationRequest<TParams extends Params = ParamsDictionary, TResponseBody = any, TRequestBody = any>
  = Request<TParams, TResponseBody, TRequestBody>
  
export interface OperationHandler<TParams extends Params = ParamsDictionary, TResponseBody = any, TRequestBody = any> {
  (context: Context, req: OperationRequest<TParams, TResponseBody, TRequestBody>, res: Response<TResponseBody>): any
}