import { intArg, queryType } from '@nexus/schema';
import { getUserId } from '../utils';

export const Query = queryType({
  definition(t) {
    t.list.field('posts', {
      type: 'Post',
      args: { cursor: intArg() },
      resolve: (_parent, { cursor }, ctx) => {
        if (cursor) {
          return ctx.prisma.post.findMany({
            take: 10,
            skip: 1,
            cursor: { id: cursor },
            orderBy: [{ id: 'desc' }],
          });
        } else {
          return ctx.prisma.post.findMany({
            take: 10,
            orderBy: [{ id: 'desc' }],
          });
        }
      },
    });

    t.field('post', {
      type: 'Post',
      args: { id: intArg({ nullable: false }) },
      resolve: (_parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: { id },
        });
      },
    });
    t.field('user', {
      type: 'User',
      args: { id: intArg({ nullable: false }) },
      resolve: (_parent, { id }, ctx) => {
        return ctx.prisma.user.findOne({
          where: { id },
        });
      },
    });
    t.field('postVote', {
      type: 'PostVote',
      args: { postId: intArg({ nullable: false }) },
      resolve: (_parent, { postId }, ctx) => {
        const userId = Number(getUserId(ctx));
        return ctx.prisma.postVote.findFirst({
          where: { postId, authorId: userId },
        });
      },
    });
    t.field('commentVote', {
      type: 'CommentVote',
      args: { commentId: intArg({ nullable: false }) },
      resolve: (_parent, { commentId }, ctx) => {
        const userId = Number(getUserId(ctx));
        return ctx.prisma.commentVote.findFirst({
          where: { commentId, authorId: userId },
        });
      },
    });
  },
});
