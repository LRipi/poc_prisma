import { Middleware } from 'koa'

export const logRequestIn: Middleware = async (ctx, next): Promise<void> => {
  const start = Date.now()
  ctx.log.info(`-> ${ctx.method} ${ctx.path}`)
  if (Object.keys(ctx.query).length) {
    ctx.log.debug(ctx.query, 'query-string')
  }
  if (Object.keys(ctx.request.body).length) {
    if (ctx.request.body.operationName === 'IntrospectionQuery') {
      ctx.log.debug('introspection query')
    } else {
      ctx.log.debug(ctx.request.body, 'body')
    }
  }
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
}

export const logResponseOut: Middleware = async (ctx, next): Promise<void> => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  ctx.log.info(`<- ${ctx.method} ${ctx.path} - ${ctx.status} ${rt}`)
}
