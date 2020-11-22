import { intArg, mutationType, stringArg } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { APP_SECRET, getUserId } from '../utils'

export const Mutation = mutationType({
  definition(t) {
    t.field('signUp', {
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
          throw new Error('Signing up failed, please try again later.')
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
          throw new Error('Signing up failed, please try again later.')
        }

        let token
        try {
          token = sign({ userId: user.id }, APP_SECRET)
        } catch (err) {
          throw new Error('Signing up failed, please try again later.')
        }

        return {
          token,
          user,
        }
      },
    })

    t.field('logIn', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        let user

        try {
          user = await ctx.prisma.user.findOne({
            where: {
              email,
            },
          })
        } catch (err) {
          throw new Error('Logging in failed, please try again later.')
        }

        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }

        let isValidPassword = false
        try {
          isValidPassword = await compare(password, user.password)
        } catch (err) {
          throw new Error('Logging in failed, please try again later.')
        }

        if (!isValidPassword) {
          throw new Error('Invalid password')
        }

        let token
        try {
          token = sign({ userId: user.id }, APP_SECRET)
        } catch (err) {
          throw new Error('Logging in failed, please try again later.')
        }

        return {
          token,
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
      resolve: async (parent, { title, content }, ctx) => {
        let userId
        try {
          userId = Number(getUserId(ctx))
        } catch (err) {
          throw new Error('Creating post failed, please try again.')
        }
        try {
          return ctx.prisma.post.create({
            data: {
              title,
              content,
              author: { connect: { id: userId } },
            },
          })
        } catch (err) {
          throw new Error('Creating post failed, please try again.')
        }
      },
    })

    t.field('editPost', {
      type: 'Post',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
      },
      resolve: async (parent, { content, id: postId }, ctx) => {
        try {
          return ctx.prisma.post.update({
            data: { content },
            where: { id: postId },
          })
        } catch (err) {
          throw new Error('Editing post failed, please try again.')
        }
      },
    })

    t.field('deletePost', {
      type: 'Message',
      nullable: true,
      args: { id: intArg({ nullable: false }) },
      resolve: async (parent, { id }, ctx) => {
        try {
          await ctx.prisma.post.delete({ where: { id } })
          return {
            message: 'Success',
          }
        } catch (err) {
          throw new Error('Deleting post failed, please try again.')
        }
      },
    })

    t.field('createComment', {
      type: 'Comment',
      nullable: true,
      args: {
        postId: intArg({ nullable: false }),
        content: stringArg({ nullable: false }),
      },
      resolve: async (parent, { postId, content }, ctx) => {
        let userId
        try {
          userId = Number(getUserId(ctx))
        } catch (err) {
          throw new Error('Creating comment failed, please try again.')
        }
        let post
        try {
          await ctx.prisma.post.findOne({ where: { id: postId } })
        } catch (err) {
          throw new Error('Creating comment failed, please try again.')
        }
        if (!post) {
          throw new Error('Creating comment failed, please try again.')
        }
        try {
          return ctx.prisma.comment.create({
            data: {
              content,
              author: { connect: { id: userId } },
              post: { connect: { id: postId } },
            },
          })
        } catch (err) {
          throw new Error('Creating comment failed, please try again.')
        }
      },
    })

    t.field('deleteComment', {
      type: 'Message',
      nullable: true,
      args: { id: intArg({ nullable: false }) },
      resolve: async (parent, { id }, ctx) => {
        try {
          await ctx.prisma.comment.delete({ where: { id } })
          return {
            message: 'Success',
          }
        } catch (err) {
          throw new Error('Deleting comment failed, please try again.')
        }
      },
    })
  },
})
