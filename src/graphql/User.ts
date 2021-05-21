import { enumType, list, objectType, queryField } from 'nexus'

export const Role = enumType({
  name: 'Role',
  members: ['User', 'Admin'],
  description: 'The role of a user',
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('email')
    t.date('createdAt')
    t.nullable.date('updatedAt')
    t.field('role', { type: 'Role' })
    t.list.field('posts', { type: 'Post' })
  },
})

export const UsersQuery = queryField('users', {
  type: list('User'),
  async resolve(_source, _args, ctx) {
    return ctx.prisma.user.findMany({
      include: { posts: true },
    })
  },
})
