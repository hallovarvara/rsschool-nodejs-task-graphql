import { resolveUsers } from './resolvers/resolve-users';
import { resolveEntities } from './resolvers/resolve-entities';
import { resolveEntityById } from './resolvers/resolve-entity-by-id';
import { resolveUserById } from './resolvers/resolve-user-by-id';
import { resolveUsersWithSubscriptionsAndProfiles } from './resolvers/resolve-users-with-subscriptions-and-profiles';
import { resolveUserByIdWithSubscribersAndPosts } from './resolvers/resolve-user-by-id-with-subscribers-and-posts';
import { resolveUsersWithSubscriptions } from './resolvers/resolve-users-with-subscriptions';
import { resolveCreateUser } from './resolvers/resolve-create-user';

export const rootValue = {
  entities: resolveEntities,
  entityById: resolveEntityById,
  users: resolveUsers,
  user: resolveUserById,
  usersWithSubscriptionsAndProfiles: resolveUsersWithSubscriptionsAndProfiles,
  userByIdWithSubscribersAndPosts: resolveUserByIdWithSubscribersAndPosts,
  usersWithSubscriptions: resolveUsersWithSubscriptions,
  createUser: resolveCreateUser,
};
