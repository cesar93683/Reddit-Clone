import { rule, shield } from 'graphql-shield';
import { getUserId } from '../utils';

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  }),
  isPostOwner: rule()(async (parent, { id: postId }, context) => {
    const userId = getUserId(context);
    const author = await context.prisma.post
      .findOne({ where: { id: Number(postId) } })
      .author();
    return userId === author.id;
  }),
  isCommentOwner: rule()(async (parent, { id: commentId }, context) => {
    const userId = getUserId(context);
    const author = await context.prisma.comment
      .findOne({ where: { id: Number(commentId) } })
      .author();
    return userId === author.id;
  }),
};

export const permissions = shield(
  {
    Mutation: {
      createPost: rules.isAuthenticatedUser,
      editPost: rules.isPostOwner,
      deletePost: rules.isPostOwner,
      createComment: rules.isAuthenticatedUser,
      deleteComment: rules.isCommentOwner,
      votePost: rules.isAuthenticatedUser,
    },
    Query: {
      postVote: rules.isAuthenticatedUser,
      commentVote: rules.isAuthenticatedUser,
    },
  },
  { allowExternalErrors: true },
);
