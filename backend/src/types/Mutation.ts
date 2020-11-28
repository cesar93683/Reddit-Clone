import { intArg, mutationType, stringArg } from '@nexus/schema';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { APP_SECRET, getUserId } from '../utils';

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
        let existingUser = await ctx.prisma.user.findOne({ where: { email } });
        if (existingUser) {
          return {
            error: 'Email already exists, please login instead.',
          };
        }

        existingUser = await ctx.prisma.user.findOne({ where: { username } });
        if (existingUser) {
          return {
            error: 'Username already exists, please login instead.',
          };
        }

        const hashedPassword = await hash(password, 12);

        const user = await ctx.prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });

        const token = sign({ userId: user.id }, APP_SECRET);

        return {
          token,
          userId: user.id,
        };
      },
    });

    t.field('logIn', {
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
        });

        if (!user) {
          return {
            error: `No user found for email: ${email}`,
          };
        }

        if (!(await compare(password, user.password))) {
          return {
            error: 'Invalid password',
          };
        }

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          userId: user.id,
        };
      },
    });

    t.field('createPost', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg({ nullable: false }),
      },
      resolve: async (parent, { title, content }, ctx) => {
        const userId = Number(getUserId(ctx));
        return ctx.prisma.post.create({
          data: {
            title,
            content,
            author: { connect: { id: userId } },
            numComments: 0,
            numVotes: 0,
            dateCreated: String(Date.now()),
            dateUpdated: String(Date.now()),
          },
        });
      },
    });

    t.field('editPost', {
      type: 'Post',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
      },
      resolve: async (parent, { content, id: postId }, ctx) => {
        return ctx.prisma.post.update({
          data: { content, dateUpdated: String(Date.now()) },
          where: { id: postId },
        });
      },
    });

    t.field('deletePost', {
      type: 'Message',
      nullable: true,
      args: { id: intArg({ nullable: false }) },
      resolve: async (parent, { id }, ctx) => {
        await ctx.prisma.commentVote.deleteMany({
          where: { comment: { post: { id } } },
        });
        await ctx.prisma.comment.deleteMany({ where: { post: { id } } });
        await ctx.prisma.postVote.deleteMany({ where: { post: { id } } });
        await ctx.prisma.post.delete({ where: { id } });
        return {
          message: 'Success',
        };
      },
    });

    t.field('createComment', {
      type: 'Comment',
      nullable: true,
      args: {
        postId: intArg({ nullable: false }),
        content: stringArg({ nullable: false }),
      },
      resolve: async (parent, { postId, content }, ctx) => {
        const userId = Number(getUserId(ctx));
        const post = await ctx.prisma.post.findOne({ where: { id: postId } });
        if (!post) {
          throw new Error();
        }
        const result = await ctx.prisma.comment.create({
          data: {
            content,
            dateCreated: String(Date.now()),
            dateUpdated: String(Date.now()),
            author: { connect: { id: userId } },
            post: { connect: { id: postId } },
            numVotes: 0,
          },
        });
        await ctx.prisma.post.update({
          where: { id: postId },
          data: { numComments: post.numComments + 1 },
        });
        return result;
      },
    });

    t.field('deleteComment', {
      type: 'Message',
      nullable: true,
      args: {
        id: intArg({ nullable: false }),
        postId: intArg({ nullable: false }),
      },
      resolve: async (parent, { id, postId }, ctx) => {
        const post = await ctx.prisma.post.findOne({ where: { id: postId } });
        if (!post) {
          throw new Error();
        }
        await ctx.prisma.commentVote.deleteMany({
          where: { comment: { id } },
        });
        await ctx.prisma.comment.delete({ where: { id } });
        await ctx.prisma.post.update({
          where: { id: postId },
          data: { numComments: post.numComments - 1 },
        });
        return {
          message: 'Success',
        };
      },
    });

    t.field('editComment', {
      type: 'Comment',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
      },
      resolve: async (parent, { content, id }, ctx) => {
        return await ctx.prisma.comment.update({
          data: { content, dateUpdated: String(Date.now()) },
          where: { id },
        });
      },
    });

    t.field('votePost', {
      type: 'Message',
      args: {
        postId: intArg({ nullable: false }),
        value: intArg({ nullable: false }),
      },
      resolve: async (parent, { postId, value }, ctx) => {
        if (value < -1 || value > 1) {
          throw new Error();
        }
        const userId = Number(getUserId(ctx));
        const post = await ctx.prisma.post.findOne({ where: { id: postId } });
        if (!post) {
          throw new Error();
        }

        const oldVote = await ctx.prisma.postVote.findFirst({
          where: { post: { id: postId }, author: { id: userId } },
        });
        if (oldVote) {
          const voteDiff = value - oldVote.value;
          if (voteDiff !== 0) {
            await ctx.prisma.postVote.updateMany({
              where: {
                authorId: userId,
                postId,
              },
              data: {
                value: value,
              },
            });
            await ctx.prisma.post.update({
              where: { id: postId },
              data: { numVotes: post.numVotes + voteDiff },
            });
          }
          return {
            message: 'Success',
          };
        }

        await ctx.prisma.postVote.create({
          data: {
            value: value,
            author: { connect: { id: userId } },
            post: { connect: { id: postId } },
          },
        });
        await ctx.prisma.post.update({
          where: { id: postId },
          data: { numVotes: post.numVotes + value },
        });
        return {
          message: 'Success',
        };
      },
    });

    t.field('voteComment', {
      type: 'Message',
      args: {
        commentId: intArg({ nullable: false }),
        value: intArg({ nullable: false }),
      },
      resolve: async (parent, { commentId, value }, ctx) => {
        if (value < -1 || value > 1) {
          throw new Error();
        }
        const userId = Number(getUserId(ctx));
        const comment = await ctx.prisma.comment.findOne({
          where: { id: commentId },
        });
        if (!comment) {
          throw new Error();
        }

        const oldVote = await ctx.prisma.commentVote.findFirst({
          where: { comment: { id: commentId }, author: { id: userId } },
        });

        if (oldVote) {
          const voteDiff = value - oldVote.value;
          if (voteDiff !== 0) {
            await ctx.prisma.commentVote.updateMany({
              where: {
                authorId: userId,
                commentId,
              },
              data: {
                value: value,
              },
            });
            await ctx.prisma.comment.update({
              where: { id: commentId },
              data: { numVotes: comment.numVotes + voteDiff },
            });
          }
          return {
            message: 'Success',
          };
        }

        await ctx.prisma.commentVote.create({
          data: {
            value: value,
            author: { connect: { id: userId } },
            comment: { connect: { id: commentId } },
          },
        });
        await ctx.prisma.comment.update({
          where: { id: commentId },
          data: { numVotes: comment.numVotes + value },
        });
        return {
          message: 'Success',
        };
      },
    });
  },
});
