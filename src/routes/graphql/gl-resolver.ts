import { resolveUsers } from './resolvers/resolve-users';
import { resolveEntities } from './resolvers/resolve-entities';
import { resolveEntityById } from './resolvers/resolve-entity-by-id';

export const rootValue = {
  entities: resolveEntities,
  entityById: resolveEntityById,
  users: resolveUsers,
};
