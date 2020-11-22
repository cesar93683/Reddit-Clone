import { intArg, queryType, stringArg } from '@nexus/schema'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.list.field('getPosts', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.post.findMany()
      },
    })

    t.field('getPostById', {
      type: 'Post',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: {
            id,
          },
        })
      },
    })
    t.list.field('getPostsByUserId', {
      type: 'Post',
      args: { userId: intArg() },
      resolve: (parent, { userId }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            authorId: userId,
          },
        })
      },
    })
  },
})
