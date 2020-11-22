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

    t.field('login', {
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
        let user
        try {
          userId = getUserId(ctx)
          user = await ctx.prisma.user.findOne({
            where: { id: Number(userId) },
          })
        } catch (err) {
          throw new Error('Creating post failed, please try again.')
        }

        if (!user) {
          throw new Error('Could not find user for provided id.')
        }

        let post

        try {
          post = ctx.prisma.post.create({
            data: {
              title,
              content,
              author: { connect: { id: Number(userId) } },
            },
          })
        } catch (err) {
          throw new Error('Creating post failed, please try again.')
        }

        return post
      },
    })

    t.field('editPost', {
      type: 'Post',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
      },
      resolve: async (parent, { content, id }, ctx) => {
        let userId: number
        let user
        try {
          userId = Number(getUserId(ctx))
          user = await ctx.prisma.user.findOne({
            where: { id: userId },
          })
        } catch (err) {
          throw new Error('Editing post failed, please try again.')
        }

        if (!user) {
          throw new Error('Could not find user for provided id.')
        }

        let post

        try {
          post = await ctx.prisma.post.findOne({ where: { id } })
        } catch (err) {
          throw new Error('Something went wrong, could not update post.')
        }

        if (!post) {
          throw Error('Post not found.')
        }

        if (post.authorId !== userId) {
          throw Error('You are not allowed to edit this post.')
        }

        try {
          post = ctx.prisma.post.update({
            data: {
              content,
            },
            where: {
              id,
            },
          })
        } catch (err) {
          throw new Error('Editing post failed, please try again.')
        }

        return post
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
