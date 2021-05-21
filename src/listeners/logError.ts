import { ExtendableContext } from 'koa'

// real type is `HttpError` from `http-errors` package which is used internally by Kao
export interface KoaError {
  message: string
  status: number
}

export default function logError(err: KoaError, ctx: ExtendableContext): void {
  ctx.log.error(`${ctx.method} ${ctx.path} - ${err.status} ${err.message}`)
}
