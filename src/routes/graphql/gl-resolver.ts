import { FastifyInstance } from 'fastify';

export const rootValue = {
  entities: async (args: any, fastify: FastifyInstance) => {
    const users = await fastify.db.users.findMany();
    const profiles = await fastify.db.profiles.findMany();
    const posts = await fastify.db.posts.findMany();
    const memberTypes = await fastify.db.memberTypes.findMany();

    return {
      users,
      profiles,
      posts,
      memberTypes,
    };
  },
};
