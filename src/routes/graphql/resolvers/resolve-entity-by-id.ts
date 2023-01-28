import { FastifyInstance } from 'fastify';

export const resolveEntityById = async (
  args: any,
  fastify: FastifyInstance,
) => {
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
};
