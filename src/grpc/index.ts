import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import * as env from 'env-var'
import prismaClient from '../../prisma/client'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'

const PROTO_PATH = __dirname + '/post.proto'

let PORT: number
try {
  PORT = env.get('GRPC_PORT').default('4001').asPortNumber()
} catch (e) {
  console.error(`ERROR! ${e.message}`)
  process.abort()
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const post = grpc.loadPackageDefinition(packageDefinition).post

async function getPost(call: any, callback: any) {
  const post = await prismaClient.post.findUnique({
    where: { id: call.request.id },
  })
  if (post) {
    const protoPost = {
      ...post,
      createdAt: Timestamp.fromDate(post.createdAt),
    }
    callback(null, { post: protoPost })
    return
  }
  callback(null, { post: null })
}

;(() => {
  const server = new grpc.Server()
  server.addService(post.PostService.service, { getPost })
  server.bindAsync(
    `localhost:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start()
      console.log(`▲ gRPC server running on port ${PORT} ▲`)
    }
  )
})()
