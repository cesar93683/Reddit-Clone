import { objectType } from '@nexus/schema';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
    t.model.author();
    t.model.comments();
    t.model.numComments();
    t.model.votes();
    t.model.numVotes();
    t.model.dateCreated();
    t.model.dateUpdated();
  },
});

export const PostPagination = objectType({
  name: 'PostPagination',
  definition(t) {
    t.list.field('posts', { type: 'Post' });
    t.int('cursor');
    t.boolean('hasMore');
  },
});
