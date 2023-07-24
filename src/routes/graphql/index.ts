import { graphql } from 'graphql';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { schema } from './schemas/schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { data } = await graphql({
        schema,
        source: req.body.query,
        contextValue: { prismaClient: fastify.prisma },
        variableValues: req.body.variables,
      });

      return { data };
    },
  });
};

export default plugin;
