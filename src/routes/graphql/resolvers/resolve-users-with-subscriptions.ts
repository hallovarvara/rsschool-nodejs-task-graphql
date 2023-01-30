import { FastifyInstance } from 'fastify';
import { UserEntityWithSubscriptions } from './types';
import { isNonEmptyArray } from '../utils/is-non-empty-array';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';

export const resolveUsersWithSubscriptions = async (
  args: any,
  fastify: FastifyInstance,
) => {
  const users: UserEntity[] = await fastify.db.users.findMany();

  if (!isNonEmptyArray(users)) {
    return [];
  }

  const usersById = users.reduce(
    (result, user) => ({
      ...result,
      [user.id]: { ...user, userSubscribedTo: [], subscribedToUser: [] },
    }),
    {} as { [key: string]: UserEntityWithSubscriptions },
  );

  for (let i = 0; i < users.length; i++) {
    const user = usersById[users[i].id];

    user?.subscribedToUserIds?.forEach((id) => {
      user.subscribedToUser.push(usersById[id]);
      usersById[id].userSubscribedTo.push(user);
    });
  }

  console.log('df');

  return Object.values(usersById);
};
