import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  changeUserBodySchema,
  createUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import DB from '../../utils/DB/DB';
import { union } from 'lodash';
import {
  getNoEntityIdErrorMessage,
  getNoEntityIdxErrorMessage,
} from '../../utils/get-error-messages';

const db = new DB();

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    reply.code(200);
    return db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const user = await db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        reply
          .code(404)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });

        return;
      }

      reply.code(200).send(user);
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<void> {
      const { firstName, lastName, email } = request.body;

      if (firstName && lastName && email) {
        const user = { firstName, lastName, email };
        const response = await db.users.create(user);
        reply.code(201).send(response);
        return;
      }

      reply.code(404).send({
        message: '"firstName", "lastName" and "email" are required for request',
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
      const users = await db.users.findMany();
      const { id } = request.params;
      const targetUser = users.find((user) => user.id === id);

      if (!targetUser) {
        reply.code(400).send({ message: getNoEntityIdErrorMessage(id) });
        return;
      }

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (user.id === id) {
          continue;
        }

        if (user.subscribedToUserIds.includes(id)) {
          await db.users.change(user.id, {
            subscribedToUserIds: user.subscribedToUserIds.filter(
              (userId) => userId !== id,
            ),
          });
        }
      }

      await db.users.delete(request.params.id);

      reply.code(200).send(targetUser);
    },
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const users = await db.users.findMany({
        key: 'id',
        equalsAnyOf: [request.body.userId, request.params.id],
      });

      const user1 = users.find((user) => user.id === request.body.userId);
      const user2 = users.find((user) => user.id === request.params.id);

      if (!user1 || !user2) {
        reply.code(400).send({
          message: getNoEntityIdxErrorMessage(
            request.body.userId,
            request.params.id,
          ),
        });
        return;
      }

      const subscribedToUserIds = union(user1.subscribedToUserIds, [user2.id]);
      await db.users.change(user1.id, { subscribedToUserIds });

      reply.code(200).send({ ...user1, subscribedToUserIds });
    },
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const users = await db.users.findMany({
        key: 'id',
        equalsAnyOf: [request.body.userId, request.params.id],
      });

      const user1 = users.find((user) => user.id === request.body.userId);
      const user2 = users.find((user) => user.id === request.params.id);

      if (!user1 || !user2) {
        reply.code(400).send({
          message: getNoEntityIdxErrorMessage(
            request.body.userId,
            request.params.id,
          ),
        });
        return;
      }

      if (!user1.subscribedToUserIds.includes(user2.id)) {
        reply.code(400).send({
          message: `User with id "${user1.id}" is not subscribed to user with id "${user2.id}"`,
        });
        return;
      }

      const subscribedToUserIds = user1.subscribedToUserIds.filter(
        (id) => id !== user2.id,
      );

      await db.users.change(user1.id, { subscribedToUserIds });

      reply.code(200).send({ ...user1, subscribedToUserIds });
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const user = await db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        reply
          .code(400)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });
        return;
      }

      const { firstName, lastName, email } = request.body;

      const newFields = {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
      };

      await db.users.change(request.params.id, newFields);
      reply.code(200);
      return { ...user, ...request.body };
    },
  );
};

export default plugin;
