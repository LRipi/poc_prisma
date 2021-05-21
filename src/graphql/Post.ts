import { ApolloError, UserInputError } from 'apollo-server-koa'
import {
  intArg,
  list,
  mutationField,
  objectType,
  queryField,
  stringArg,
} from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.date('createdAt')
    t.nullable.date('updatedAt')
    t.string('title')
    t.string('content')
    t.boolean('published')
    t.field('author', {
      type: 'User',
      async resolve(source, _, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: source.authorId },
          include: {
            posts: true,
          },
        })
        if (!user) {
          throw new ApolloError(`author does not exist for post [${source.id}]`)
        }
        return user
      },
    })
  },
})

export const PostQuery = queryField('post', {
  type: Post,
  args: { id: intArg() },
  async resolve(_, args, ctx) {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: args.id,
      },
    })
    if (!post) {
      throw new UserInputError(`post not found for ID [${args.id}]`)
    }
    return post
  },
})

export const PostsQuery = queryField('posts', {
  type: list('Post'),
  async resolve(_source, _args, ctx) {
    return ctx.prisma.post.findMany()
  },
})

export const createPost = mutationField('createPost', {
  type: 'Post',
  args: { title: stringArg(), content: stringArg(), authorId: intArg() },
  async resolve(_source, args, ctx) {
    const user = await ctx.prisma.user.findUnique({
      where: { id: args.authorId },
    })
    if (!user) {
      throw new ApolloError(`user not found for ID ${args.authorId}`)
    }
    return ctx.prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: args.authorId,
      },
    })
  },
})
