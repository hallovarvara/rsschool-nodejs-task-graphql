import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import { db } from '../../utils/db-instance';
import {
  getNoEntityIdErrorMessage,
  getNoRequiredFieldsErrorMessage,
} from '../../utils/get-error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<void> {
    const profiles = await db.profiles.findMany();
    reply.code(200).send(profiles);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const profile = await db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        reply
          .code(404)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });

        return;
      }

      reply.code(200).send(profile);
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<void> {
      const {
        avatar,
        sex,
        birthday,
        country,
        street,
        city,
        memberTypeId,
        userId,
      } = request.body;

      const profiles = await db.profiles.findMany();

      if (profiles.some((profile) => profile.userId === userId)) {
        reply
          .code(400)
          .send({ message: `User with id "${userId}" already has a profile` });
        return;
      }

      const memberTypes = await db.memberTypes.findMany();

      if (!memberTypes.some((memberType) => memberType.id === memberTypeId)) {
        reply
          .code(400)
          .send({ message: `Member type id "${memberTypeId}" does not exist` });
        return;
      }

      if (
        avatar &&
        sex &&
        birthday &&
        country &&
        street &&
        city &&
        memberTypeId &&
        userId
      ) {
        const profile = {
          avatar,
          sex,
          birthday,
          country,
          street,
          city,
          memberTypeId,
          userId,
        };

        const response = await db.profiles.create(profile);
        reply.code(201).send(response);
        return;
      }

      reply.code(404).send({
        message: getNoRequiredFieldsErrorMessage(
          'avatar',
          'sex',
          'birthday',
          'country',
          'street',
          'city',
          'memberTypeId',
          'userId',
        ),
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
      const profiles = await db.profiles.findMany();
      const { id } = request.params;
      const targetProfile = profiles.find((profile) => profile.id === id);

      if (!targetProfile) {
        reply.code(400).send({ message: getNoEntityIdErrorMessage(id) });
        return;
      }

      await db.profiles.delete(request.params.id);

      reply.code(200).send(targetProfile);
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const profile = await db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        reply
          .code(400)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });
        return;
      }

      const { avatar, sex, birthday, country, street, city, memberTypeId } =
        request.body;

      const newFields = {
        avatar: avatar || profile.avatar,
        sex: sex || profile.sex,
        birthday: birthday || profile.birthday,
        country: country || profile.country,
        street: street || profile.street,
        city: city || profile.city,
        memberTypeId: memberTypeId || profile.memberTypeId,
      };

      await db.profiles.change(request.params.id, newFields);

      reply.code(200).send({ ...profile, ...newFields });
    },
  );
};

export default plugin;
