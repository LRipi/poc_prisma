import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import env from 'env-var'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import pino from 'koa-pino-logger'
import helmet from 'koa-helmet'
import { logRequestIn, logResponseOut, error } from './middlewares'
import { logError } from './listeners'
import { context } from './api'
import { schema } from './nexus'

let PORT: number
try {
  PORT = env.get('PORT').required().asPortNumber()
} catch (e) {
  console.error(`ERROR! ${e.message}`)
  process.abort()
}

const isDev =
  env.get('NODE_ENV').default('development').asString() === 'development'

const app = new Koa()
const router = new Router()

app
  .use(bodyParser())
  .use(helmet({ contentSecurityPolicy: false }))
  .use(
    pino({
      level: isDev ? 'debug' : 'info',
      // do not flood on dev
      autoLogging: !isDev,
      redact: isDev
        ? { paths: ['req', 'res', 'responseTime'], remove: true }
        : undefined,
      prettyPrint: isDev
        ? { colorize: true, ignore: 'pid,hostname,time' }
        : false,
    })
  )

// dev logger
if (isDev) {
  app.use(logResponseOut).use(logRequestIn)
}

app.on('error', logError)

// set the response's status and body to the error value
app.use(error)

// is alive check
router.get('/healthz', (ctx) => {
  ctx.status = 200
})

router.get('/', (ctx) => {
  ctx.status = 200
})
;(async () => {
  // Apollo
  const server = new ApolloServer({
    // nexus generated schema
    schema,
    context,
  })
  await server.start()

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(server.getMiddleware({ bodyParserConfig: false }))
    .listen(PORT, () => console.log(`▲ prisma poc running on port ${PORT} ▲`))
})()
