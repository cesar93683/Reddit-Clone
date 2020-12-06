import { intArg, queryType } from '@nexus/schema';
import { getUserId } from '../utils';

export const Query = queryType({
  definition(t) {
    t.list.field('posts', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.post.findMany();
      },
    });

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: { id: intArg() },
      resolve: (_parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: { id },
        });
      },
    });
    t.field('user', {
      type: 'User',
      args: { id: intArg() },
      resolve: (_parent, { id }, ctx) => {
        return ctx.prisma.user.findOne({
          where: { id },
        });
      },
    });
    t.field('postVote', {
      type: 'PostVote',
      args: { postId: intArg() },
      resolve: (_parent, { postId }, ctx) => {
        const userId = Number(getUserId(ctx));
        return ctx.prisma.postVote.findFirst({
          where: { postId, authorId: userId },
        });
      },
    });
    t.field('commentVote', {
      type: 'CommentVote',
      args: { commentId: intArg() },
      resolve: (_parent, { commentId }, ctx) => {
        const userId = Number(getUserId(ctx));
        return ctx.prisma.commentVote.findFirst({
          where: { commentId, authorId: userId },
        });
      },
    });
  },
});
