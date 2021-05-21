import { Middleware } from 'koa'

const error: Middleware = async (ctx, next): Promise<void> => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
}

export default error
