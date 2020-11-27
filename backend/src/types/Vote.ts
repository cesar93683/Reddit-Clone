import { objectType } from '@nexus/schema';

export const Vote = objectType({
  name: 'Vote',
  definition(t) {
    t.model.id();
    t.model.value();
    t.model.author();
    t.model.post();
  },
});
