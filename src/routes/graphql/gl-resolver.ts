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

  entityById: async (args: any, fastify: FastifyInstance) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });

    const profile = await fastify.db.profiles.findOne({
      key: 'id',
      equals: args.id,
    });

    const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id });

    const memberType = await fastify.db.memberTypes.findOne({
      key: 'id',
      equals: args.id,
    });

    return {
      user,
      profile,
      post,
      memberType,
    };
  },
};
