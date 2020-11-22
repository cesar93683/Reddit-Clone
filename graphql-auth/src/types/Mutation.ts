import { intArg, mutationType, stringArg } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { APP_SECRET, getUserId } from '../utils'

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        username: stringArg({ nullable: false }),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { username, email, password }, ctx) => {
        try {
          const hashedPassword = await hash(password, 10)
          const user = await ctx.prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
            },
          })
          return {
            token: sign({ userId: user.id }, APP_SECRET),
            user,
          }
        } catch (err) {
          throw new Error('An error occured')
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        try {
          const user = await ctx.prisma.user.findOne({
            where: {
              email,
            },
          })
          if (!user) {
            throw new Error(`No user found for email: ${email}`)
          }
          const passwordValid = await compare(password, user.password)
          if (!passwordValid) {
            throw new Error('Invalid password')
          }
          return {
            token: sign({ userId: user.id }, APP_SECRET),
            user,
          }
        } catch (err) {
          throw new Error('An error occured')
        }
      },
    })

    t.field('createPost', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg({ nullable: false }),
      },
      resolve: (parent, { title, content }, ctx) => {
        try {
          const userId = getUserId(ctx)
          if (!userId) throw new Error('Could not authenticate user.')
          return ctx.prisma.post.create({
            data: {
              title,
              content,
              author: { connect: { id: Number(userId) } },
            },
          })
        } catch (err) {
          throw new Error('An error occured')
        }
      },
    })

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: { id: intArg({ nullable: false }) },
      resolve: (parent, { id }, ctx) => {
        try {
          return ctx.prisma.post.delete({
            where: {
              id,
            },
          })
        } catch (err) {
          throw new Error('An error occured')
        }
      },
    })
  },
})
