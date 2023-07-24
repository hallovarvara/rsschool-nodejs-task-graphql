import { GraphQLList } from 'graphql';
import { DatabaseT } from '../types/database.type.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from '../types/profile.type.js';

export const ProfileQueries = {
  profile: {
    type: ProfileType,
    args: { id: { type: UUIDType } },
    resolve: async (_p: unknown, { id }: { id: string }, db: DatabaseT) =>
      await db.prismaClient.profile.findUnique({ where: { id } }),
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_p: unknown, _a: unknown, db: DatabaseT) =>
      await db.prismaClient.profile.findMany(),
  },
};
