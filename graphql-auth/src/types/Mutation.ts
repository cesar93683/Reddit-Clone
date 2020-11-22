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
        let existingUser
        try {
          existingUser = await ctx.prisma.user.findOne({ where: { email } })
        } catch (err) {
          throw new Error('Signing up failed, please try again later.')
        }

        if (existingUser) {
          throw new Error('User exists already, please login instead.')
        }

        let hashedPassword
        try {
          hashedPassword = await hash(password, 12)
        } catch (err) {
          throw new Error('Could not create user, please try again.')
        }

        let user

        try {
          user = await ctx.prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
            },
          })
        } catch (err) {
          throw new Error('Could not create user, please try again.')
        }

        let token
        try {
          token = sign({ userId: user.id }, APP_SECRET)
        } catch (err) {
          throw new Error('Could not create user, please try again.')
        }

        return {
          token,
          user,
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
      },
    })

    t.field('createPost', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg({ nullable: false }),
      },
      resolve: (parent, { title, content }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.post.create({
          data: {
            title,
            content,
            author: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('editPost', {
      type: 'Post',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
      },
      resolve: (parent, { content, id }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.post.update({
          data: {
            content,
          },
          where: {
            id,
          },
        })
      },
    })

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: { id: intArg({ nullable: false }) },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.delete({
          where: {
            id,
          },
        })
      },
    })
  },
})
