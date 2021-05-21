import { PrismaClient } from '@prisma/client'
import { Context, ExtendableContext } from 'koa'
import prismaClient from '../../prisma/client'

// https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields
export function context(ctx: { ctx: Context }): ExtendableContext {
  return { ...ctx.ctx, prisma: prismaClient }
}

// declaration merging, add Prisma client instance to koa context type
declare module 'koa' {
  interface ExtendableContext {
    prisma: PrismaClient
  }
}

export type ResolverContext = ExtendableContext
