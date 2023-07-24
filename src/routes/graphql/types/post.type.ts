import { GraphQLObjectType, GraphQLString } from 'graphql';

import { DatabaseT } from './database.type.js';
import { UUIDType } from './uuid.js';
import { UserType } from './user.type.js';

export const PostType: GraphQLObjectType<{ authorId: string }, DatabaseT> =
  new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      authorId: { type: UUIDType },
      content: { type: GraphQLString },
      id: { type: UUIDType },
      title: { type: GraphQLString },

      author: {
        type: UserType,
        resolve: async (
          { authorId: id }: { authorId: string },
          _a: unknown,
          db: DatabaseT,
        ) =>
          await db.prismaClient.user.findUnique({
            where: { id },
          }),
      },
    }),
  });
