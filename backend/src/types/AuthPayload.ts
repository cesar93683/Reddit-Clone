import { objectType } from '@nexus/schema';

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token');
    t.int('userId');
    t.string('error');
  },
});
