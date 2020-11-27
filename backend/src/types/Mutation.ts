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
        let existingUser;
        try {
          existingUser = await ctx.prisma.user.findOne({ where: { email } });
        } catch (err) {
          throw new Error('Signing up failed, please try again later.');
        }

        if (existingUser) {
          throw new Error('User exists already, please login instead.');
        }

        let hashedPassword;
        try {
          hashedPassword = await hash(password, 12);
        } catch (err) {
          throw new Error('Signing up failed, please try again later.');
        }

        let user;

        try {
          user = await ctx.prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
            },
          });
        } catch (err) {
          throw new Error('Signing up failed, please try again later.');
        }

        let token;
        try {
          token = sign({ userId: user.id }, APP_SECRET);
        } catch (err) {
          throw new Error('Signing up failed, please try again later.');
        }

        return {
          token,
          user,
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
        let user;

        try {
          user = await ctx.prisma.user.findOne({
            where: {
              email,
            },
          });
        } catch (err) {
          throw new Error('Logging in failed, please try again later.');
        }

        if (!user) {
          throw new Error(`No user found for email: ${email}`);
        }

        let isValidPassword = false;
        try {
          isValidPassword = await compare(password, user.password);
        } catch (err) {
          throw new Error('Logging in failed, please try again later.');
        }

        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        let token;
        try {
          token = sign({ userId: user.id }, APP_SECRET);
        } catch (err) {
          throw new Error('Logging in failed, please try again later.');
        }

        return {
          token,
          user,
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
        let userId;
        try {
          userId = Number(getUserId(ctx));
        } catch (err) {
          throw new Error('Creating post failed, please try again.');
        }
        try {
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
        } catch (err) {
          throw new Error('Creating post failed, please try again.');
        }
      },
    });

    t.field('editPost', {
      type: 'Post',
      args: {
        content: stringArg({ nullable: false }),
        id: intArg({ nullable: false }),
      },
      resolve: async (parent, { content, id: postId }, ctx) => {
        try {
          return ctx.prisma.post.update({
            data: { content, dateUpdated: String(Date.now()) },
            where: { id: postId },
          });
        } catch (err) {
          throw new Error('Editing post failed, please try again.');
        }
      },
    });

    t.field('deletePost', {
      type: 'Message',
      nullable: true,
      args: { id: intArg({ nullable: false }) },
      resolve: async (parent, { id }, ctx) => {
        try {
          await ctx.prisma.commentVote.deleteMany({
            where: { comment: { post: { id } } },
          });
          await ctx.prisma.comment.deleteMany({ where: { post: { id } } });
          await ctx.prisma.postVote.deleteMany({ where: { post: { id } } });
          await ctx.prisma.post.delete({ where: { id } });
          return {
            message: 'Success',
          };
        } catch (err) {
          console.log(err);
          throw new Error('Deleting post failed, please try again.');
        }
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
        let userId;
        try {
          userId = Number(getUserId(ctx));
        } catch (err) {
          throw new Error('Creating comment failed, please try again.');
        }
        let post;
        try {
          post = await ctx.prisma.post.findOne({ where: { id: postId } });
        } catch (err) {
          throw new Error('Creating comment failed, please try again.');
        }
        if (!post) {
          throw new Error('Creating comment failed, please try again.');
        }
        try {
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
        } catch (err) {
          throw new Error('Creating comment failed, please try again.');
        }
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
        let post = await ctx.prisma.post.findOne({ where: { id: postId } });
        if (!post) {
          throw new Error('Deleting comment failed, please try again.');
        }
        try {
          await ctx.prisma.comment.delete({ where: { id } });
          await ctx.prisma.commentVote.deleteMany({
            where: { comment: { id } },
          });
          await ctx.prisma.post.update({
            where: { id: postId },
            data: { numComments: post.numComments - 1 },
          });
        } catch (err) {
          throw new Error('Deleting comment failed, please try again.');
        }
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
          throw new Error('Vote must be -1, 0, or 1');
        }
        let userId;
        try {
          userId = Number(getUserId(ctx));
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }
        let post;
        try {
          post = await ctx.prisma.post.findOne({ where: { id: postId } });
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }
        if (!post) {
          throw new Error('Post does not exist');
        }

        let oldVote;
        try {
          oldVote = await ctx.prisma.postVote.findFirst({
            where: { post: { id: postId }, author: { id: userId } },
          });
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }

        if (oldVote) {
          const voteDiff = value - oldVote.value;
          if (voteDiff !== 0) {
            try {
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
            } catch (err) {
              throw new Error('Voting failed, please try again.');
            }
          }
          return {
            message: 'Success',
          };
        }

        try {
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
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }
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
          throw new Error('Vote must be -1, 0, or 1');
        }
        let userId;
        try {
          userId = Number(getUserId(ctx));
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }
        let comment;
        try {
          comment = await ctx.prisma.comment.findOne({
            where: { id: commentId },
          });
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }
        if (!comment) {
          throw new Error('Comment does not exist');
        }

        let oldVote;
        try {
          oldVote = await ctx.prisma.commentVote.findFirst({
            where: { comment: { id: commentId }, author: { id: userId } },
          });
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }

        if (oldVote) {
          const voteDiff = value - oldVote.value;
          if (voteDiff !== 0) {
            try {
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
            } catch (err) {
              throw new Error('Voting failed, please try again.');
            }
          }
          return {
            message: 'Success',
          };
        }

        try {
          await ctx.prisma.commentVote.create({
            data: {
              value: value,
              author: { connect: { id: userId } },
              comment: { connect: { id: commentId } },
            },
          });
          await ctx.prisma.post.update({
            where: { id: commentId },
            data: { numVotes: comment.numVotes + value },
          });
        } catch (err) {
          throw new Error('Voting failed, please try again.');
        }
        return {
          message: 'Success',
        };
      },
    });
  },
});
