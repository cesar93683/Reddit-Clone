import { GraphQLServer } from 'graphql-yoga';
import { createContext } from './context';
import { permissions } from './permissions';
import { schema } from './schema';

new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
}).start(() =>
  console.log(
    `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-auth#using-the-graphql-api`,
  ),
);
