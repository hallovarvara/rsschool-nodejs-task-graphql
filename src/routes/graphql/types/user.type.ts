import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList } from 'graphql';
import { DatabaseT } from './database.type.js';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.type.js';
import { PostType } from './post.type.js';

export const UserType: GraphQLObjectType<{ id: string }, DatabaseT> =
  new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: UUIDType },
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },

      posts: {
        type: new GraphQLList(PostType),
        resolve: async ({ id: authorId }, _a: unknown, db: DatabaseT) =>
          await db.prismaClient.post.findMany({ where: { authorId } }),
      },

      profile: {
        type: ProfileType,
        resolve: async ({ id: userId }, _a: unknown, db: DatabaseT) =>
          await db.prismaClient.profile.findUnique({ where: { userId } }),
      },

      subscribedToUser: {
        type: new GraphQLList(UserType),
        resolve: async ({ id: authorId }, _a: unknown, db: DatabaseT) =>
          (
            await db.prismaClient.subscribersOnAuthors.findMany({
              where: { authorId },
              select: { subscriber: true },
            })
          ).map(({ subscriber }) => subscriber),
      },

      userSubscribedTo: {
        type: new GraphQLList(UserType),
        resolve: async ({ id: subscriberId }, _a: unknown, db: DatabaseT) =>
          (
            await db.prismaClient.subscribersOnAuthors.findMany({
              where: { subscriberId },
              select: { author: true },
            })
          ).map(({ author }) => author),
      },
    }),
  });
