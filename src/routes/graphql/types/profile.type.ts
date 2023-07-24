import { UUIDType } from './uuid.js';
import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { DatabaseT } from './database.type.js';
import { MemberType, MemberTypeId } from './member-type.type.js';
import { UserType } from './user.type.js';

export const ProfileType: GraphQLObjectType<
  {
    userId: string;
    memberTypeId: string;
  },
  DatabaseT
> = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    memberTypeId: { type: MemberTypeId },
    userId: { type: UUIDType },
    yearOfBirth: { type: GraphQLInt },

    memberType: {
      type: MemberType,
      resolve: async ({ memberTypeId: id }, _a: unknown, db: DatabaseT) =>
        await db.prismaClient.memberType.findUnique({ where: { id } }),
    },

    user: {
      type: UserType,
      resolve: async ({ userId: id }, _a: unknown, db: DatabaseT) =>
        await db.prismaClient.user.findUnique({ where: { id } }),
    },
  }),
});
