import { objectType } from '@nexus/schema';

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.string('message');
  },
});
