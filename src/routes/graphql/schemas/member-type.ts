import { GraphQLList } from 'graphql';
import { DatabaseT } from '../types/database.type.js';
import { MemberType, MemberTypeId } from '../types/member-type.type.js';

export const MemberTypeQueries = {
  memberType: {
    type: MemberType,
    args: { id: { type: MemberTypeId } },
    resolve: async (_p: unknown, { id }: { id: string }, db: DatabaseT) =>
      await db.prismaClient.memberType.findUnique({ where: { id } }),
  },

  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: async (_p: unknown, _a: unknown, db: DatabaseT) =>
      await db.prismaClient.memberType.findMany(),
  },
};
