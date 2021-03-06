import { objectType } from '@nexus/schema';

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.model.id();
    t.model.content();
    t.model.author();
    t.model.post();
    t.model.numVotes();
    t.model.dateCreated();
    t.model.dateUpdated();
  },
});
