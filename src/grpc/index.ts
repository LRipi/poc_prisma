import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import * as env from 'env-var'
import prismaClient from '../../prisma/client'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import { ProtoGrpcType } from './generated/post'
import { PostServiceHandlers } from './generated/post/PostService'
import { PostReply } from './generated/post/PostReply'

const PROTO_PATH = __dirname + '/proto/post.proto'

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

const grpcObjects = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType

const handler: PostServiceHandlers = {
  async GetPost(call, callback) {
    const post = await prismaClient.post.findUnique({
      where: { id: call.request.id },
    })
    if (post) {
      const protoPost: PostReply = {
        post: {
          ...post,
          createdAt: Timestamp.fromDate(post.createdAt),
        },
      }
      callback(null, protoPost)
      return
    }
    callback(null, { post: null })
  },
}

;(() => {
  const server = new grpc.Server()
  server.addService(grpcObjects.post.PostService.service, handler)
  server.bindAsync(
    `localhost:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start()
      console.log(`▲ gRPC server running on port ${PORT} ▲`)
    }
  )
})()
