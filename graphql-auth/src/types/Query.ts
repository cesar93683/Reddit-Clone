import { intArg, queryType } from '@nexus/schema'

export const Query = queryType({
  definition(t) {
    t.list.field('getAllPosts', {
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
          where: { id },
        })
      },
    })
    t.field('getUser', {
      type: 'User',
      args: { userId: intArg() },
      resolve: (parent, { userId }, ctx) => {
        return ctx.prisma.user.findOne({
          where: { id: userId },
        })
      },
    })
  },
})
