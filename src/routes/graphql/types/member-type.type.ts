import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { ProfileType } from './profile.type.js';
import { DatabaseT } from './database.type.js';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const MemberType: GraphQLObjectType<{ id: string }, DatabaseT> =
  new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: { type: new GraphQLNonNull(MemberTypeId) },
      discount: { type: GraphQLFloat },
      postsLimitPerMonth: { type: GraphQLInt },

      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (
          { id: memberTypeId }: { id: string },
          _a: unknown,
          db: DatabaseT,
        ) => await db.prismaClient.profile.findMany({ where: { memberTypeId } }),
      },
    }),
  });
