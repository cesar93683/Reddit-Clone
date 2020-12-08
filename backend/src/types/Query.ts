import { intArg, queryType } from '@nexus/schema';
import { getUserId } from '../utils';

export const Query = queryType({
  definition(t) {
    t.field('posts', {
      type: 'PostPagination',
      args: { cursor: intArg(), limit: intArg() },
      resolve: async (_parent, { cursor, limit }, ctx) => {
        limit = Math.min(10, limit ? limit : 10);
        let posts;
        if (cursor) {
          posts = await ctx.prisma.post.findMany({
            take: limit + 1,
            skip: 1,
            cursor: { id: cursor },
            orderBy: [{ dateCreated: 'desc' }],
          });
        } else {
          posts = await ctx.prisma.post.findMany({
            take: limit + 1,
            orderBy: [{ dateCreated: 'desc' }],
          });
        }
        const hasMore = posts.length === limit + 1;
        posts = posts.length
          ? posts.slice(0, Math.min(posts.length, limit))
          : [];
        return {
          posts,
          cursor: posts.length ? posts[posts.length - 1].id : null,
          hasMore,
        };
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
