import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import { MemberTypeQueries } from './member-type.js';
import { ProfileQueries } from './profile.js';
import { UserQueries } from './user.js';
import { PostQueries } from './post.js';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      ...MemberTypeQueries,
      ...ProfileQueries,
      ...UserQueries,
      ...PostQueries,
    }),
  }),
});
