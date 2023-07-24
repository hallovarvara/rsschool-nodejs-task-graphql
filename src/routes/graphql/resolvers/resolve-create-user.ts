import { FastifyInstance } from 'fastify';
import { UserEntityWithRelations } from './types';
import { areAllObjectFieldsDefined } from '../utils/are-all-object-fields-defined';

export const resolveCreateUser = async (
  args: any,
  fastify: FastifyInstance,
) => {
  const { email, firstName, lastName } = args.input;

  const existingUser: UserEntityWithRelations = await fastify.db.users.findOne({
    key: 'email',
    equals: email,
  });

  if (existingUser) {
    return { message: 'User with this email exists' };
  }

  const user = { email, firstName, lastName };

  if (areAllObjectFieldsDefined(user)) {
    return await fastify.db.users.create(user);
  }

  return {};
};
