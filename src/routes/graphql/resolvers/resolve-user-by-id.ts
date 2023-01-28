import { FastifyInstance } from 'fastify';
import { UserEntityWithRelations } from './types';

export const resolveUserById = async (args: any, fastify: FastifyInstance) => {
  const user: UserEntityWithRelations = await fastify.db.users.findOne({
    key: 'id',
    equals: args.id,
  });

  if (user) {
    user.posts = await fastify.db.posts.findMany({
      key: 'userId',
      equals: user.id,
    });

    const profile = await fastify.db.profiles.findOne({
      key: 'userId',
      equals: user.id,
    });

    if (profile) {
      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: profile?.memberTypeId,
      });

      user.profile = { ...profile, memberType };
    }
  }

  return user;
};
