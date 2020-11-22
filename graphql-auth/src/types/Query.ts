import { intArg, queryType, stringArg } from '@nexus/schema'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.list.field('getPosts', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        try {
          return ctx.prisma.post.findMany()
        } catch (err) {
          throw new Error('Could not get posts')
        }
      },
    })

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })
  },
})
