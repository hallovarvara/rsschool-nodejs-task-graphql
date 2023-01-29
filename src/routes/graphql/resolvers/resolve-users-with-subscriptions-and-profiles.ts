import { FastifyInstance } from 'fastify';
import { UserEntityWithSubscriptions } from './types';
import { isNonEmptyArray } from '../utils/is-non-empty-array';

export const resolveUsersWithSubscriptionsAndProfiles = async (
  args: any,
  fastify: FastifyInstance,
) => {
  const users: UserEntityWithSubscriptions[] =
    await fastify.db.users.findMany();

  if (!users || users.length === 0) {
    return [];
  }

  const usersById = users.reduce(
    (result, user) => ({ ...result, [user.id]: user }),
    {} as { [key: string]: UserEntityWithSubscriptions },
  );

  for (let i = 0; i < users.length; i++) {
    const user: UserEntityWithSubscriptions = users[i];

    if (!user.userSubscribedTo) {
      user.userSubscribedTo = [];
    }

    if (isNonEmptyArray(user.subscribedToUserIds)) {
      for (let j = 0; j < user.subscribedToUserIds.length; j++) {
        const subscriberId = user.subscribedToUserIds[j];

        usersById[subscriberId].userSubscribedTo = [
          ...(usersById[subscriberId].userSubscribedTo || []),
          user.id,
        ];
      }
    }

    usersById[user.id].profile =
      (await fastify.db.profiles.findOne({
        key: 'userId',
        equals: user.id,
      })) || undefined;
  }

  return Object.values(usersById);
};
