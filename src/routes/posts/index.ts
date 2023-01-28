import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import {
  getNoEntityIdErrorMessage,
  getNoRequiredFieldsErrorMessage,
} from '../../utils/get-error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<void> {
    const posts = await fastify.db.posts.findMany();
    reply.code(200).send(posts);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!post) {
        reply
          .code(404)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });

        return;
      }

      reply.code(200).send(post);
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<void> {
      const { title, content, userId } = request.body;

      if (title && content && userId) {
        const post = { title, content, userId };
        const response = await fastify.db.posts.create(post);
        reply.code(201).send(response);
        return;
      }

      reply.code(404).send({
        message: getNoRequiredFieldsErrorMessage('title', 'content', 'userId'),
      });
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const posts = await fastify.db.posts.findMany();
      const { id } = request.params;
      const targetPost = posts.find((post) => post.id === id);

      if (!targetPost) {
        reply.code(400).send({ message: getNoEntityIdErrorMessage(id) });
        return;
      }

      await fastify.db.posts.delete(request.params.id);

      reply.code(200).send(targetPost);
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!post) {
        reply
          .code(400)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });
        return;
      }

      const { title, content } = request.body;

      const newFields = {
        title: title || post.title,
        content: content || post.content,
      };

      await fastify.db.posts.change(request.params.id, newFields);

      reply.code(200).send({ ...post, ...newFields });
    },
  );
};

export default plugin;
