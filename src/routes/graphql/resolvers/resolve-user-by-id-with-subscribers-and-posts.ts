import { FastifyInstance } from 'fastify';
import { UserEntityWithSubscribersAndPosts } from './types';
import { isNonEmptyArray } from '../utils/is-non-empty-array';

export const resolveUserByIdWithSubscribersAndPosts = async (
  args: any,
  fastify: FastifyInstance,
) => {
  const user: UserEntityWithSubscribersAndPosts | null =
    await fastify.db.users.findOne({
      key: 'id',
      equals: args.id,
    });

  if (user) {
    user.subscribedToUser = isNonEmptyArray(user.subscribedToUserIds)
      ? await fastify.db.users.findMany({
          key: 'id',
          equals: args.id,
        })
      : [];

    user.posts = await fastify.db.posts.findMany({
      key: 'userId',
      equals: user.id,
    });
  }

  return user;
};
