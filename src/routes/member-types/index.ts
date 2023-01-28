import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import { db } from '../../utils/db-instance';
import { getNoEntityIdErrorMessage } from '../../utils/get-error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<void> {
    const memberTypes = await db.memberTypes.findMany();
    reply.code(200).send(memberTypes);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const memberType = await db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!memberType) {
        reply
          .code(404)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });

        return;
      }

      reply.code(200).send(memberType);
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<void> {
      const memberType = await db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!memberType) {
        reply
          .code(400)
          .send({ message: getNoEntityIdErrorMessage(request.params.id) });
        return;
      }

      const { discount, monthPostsLimit } = request.body;

      const newFields = {
        discount: discount || memberType.discount,
        monthPostsLimit: monthPostsLimit || memberType.monthPostsLimit,
      };

      await db.memberTypes.change(request.params.id, newFields);

      reply.code(200).send({ ...memberType, ...newFields });
    },
  );
};

export default plugin;
