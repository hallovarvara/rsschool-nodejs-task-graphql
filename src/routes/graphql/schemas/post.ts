import { GraphQLList } from 'graphql';
import { DatabaseT } from '../types/database.type.js';
import { UUIDType } from '../types/uuid.js';
import { PostType } from '../types/post.type.js';

export const PostQueries = {
  post: {
    type: PostType,
    args: { id: { type: UUIDType } },
    resolve: async (_p: unknown, { id }: { id: string }, db: DatabaseT) =>
      await db.prismaClient.post.findUnique({ where: { id } }),
  },

  posts: {
    type: new GraphQLList(PostType),
    resolve: async (_p: unknown, _a: unknown, db: DatabaseT) =>
      await db.prismaClient.post.findMany(),
  },
};
