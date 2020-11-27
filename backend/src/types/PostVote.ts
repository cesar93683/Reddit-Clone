import { objectType } from '@nexus/schema';

export const PostVote = objectType({
  name: 'PostVote',
  definition(t) {
    t.model.id();
    t.model.value();
    t.model.author();
    t.model.post();
  },
});
