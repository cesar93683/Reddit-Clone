import { objectType } from '@nexus/schema';

export const CommentVote = objectType({
  name: 'CommentVote',
  definition(t) {
    t.model.id();
    t.model.value();
    t.model.author();
    t.model.comment();
  },
});
