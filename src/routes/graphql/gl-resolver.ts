import { resolveUsers } from './resolvers/resolve-users';
import { resolveEntities } from './resolvers/resolve-entities';
import { resolveEntityById } from './resolvers/resolve-entity-by-id';
import { resolveUserById } from './resolvers/resolve-user-by-id';

export const rootValue = {
  entities: resolveEntities,
  entityById: resolveEntityById,
  users: resolveUsers,
  user: resolveUserById,
};
