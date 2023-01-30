import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql } from 'graphql';
import { schema } from './gl-schema';
import { rootValue } from './gl-resolver';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.post(
    '/',
    { schema: { body: graphqlBodySchema } },
    async function (request, reply) {
      const response = await graphql({
        contextValue: fastify,
        schema,
        source: String(request.body.query),
        rootValue,
        variableValues: request.body.variables,
      });

      reply.send(response);
    },
  );
};

export default plugin;
