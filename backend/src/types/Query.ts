import { intArg, queryType } from '@nexus/schema';
import { getUserId } from '../utils';

export const Query = queryType({
  definition(t) {
    t.list.field('getAllPosts', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.post.findMany();
      },
    });

    t.field('getPostById', {
      type: 'Post',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: { id },
        });
      },
    });
    t.field('getUser', {
      type: 'User',
      args: { userId: intArg() },
      resolve: (parent, { userId }, ctx) => {
        return ctx.prisma.user.findOne({
          where: { id: userId },
        });
      },
    });
    t.field('getPostVote', {
      type: 'PostVote',
      args: { postId: intArg() },
      resolve: (parent, { postId }, ctx) => {
        let userId;
        try {
          userId = Number(getUserId(ctx));
        } catch (err) {
          throw new Error('Getting vote failed, please try again.');
        }
        return ctx.prisma.postVote.findFirst({
          where: { postId, authorId: userId },
        });
      },
    });
    t.field('getCommentVote', {
      type: 'CommentVote',
      args: { commentId: intArg() },
      resolve: (parent, { commentId }, ctx) => {
        let userId;
        try {
          userId = Number(getUserId(ctx));
        } catch (err) {
          throw new Error('Getting vote failed, please try again.');
        }
        return ctx.prisma.commentVote.findFirst({
          where: { commentId, authorId: userId },
        });
      },
    });
  },
});
