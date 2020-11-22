import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.posts({ pagination: false })
    t.model.comments({ pagination: false })
  },
})
