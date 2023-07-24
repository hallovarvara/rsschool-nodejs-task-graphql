import { GraphQLList } from 'graphql';
import { DatabaseT } from '../types/database.type.js';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.type.js';

export const UserQueries = {
  user: {
    type: UserType,
    args: { id: { type: UUIDType } },
    resolve: async (_p: unknown, { id }: { id: string }, db: DatabaseT) =>
      await db.prismaClient.user.findUnique({ where: { id } }),
  },

  users: {
    type: new GraphQLList(UserType),
    resolve: async (_p: unknown, _a: unknown, db: DatabaseT) =>
      await db.prismaClient.user.findMany(),
  },
};
