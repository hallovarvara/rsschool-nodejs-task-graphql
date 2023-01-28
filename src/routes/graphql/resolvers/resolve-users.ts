import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

type ProfileWithMemberTypeEntity = ProfileEntity & {
  memberType: MemberTypeEntity | null;
};

type UserEntityWithRelations = UserEntity & {
  posts?: PostEntity[];
  profile?: ProfileWithMemberTypeEntity;
};

export const resolveUsers = async (args: any, fastify: FastifyInstance) => {
  const users = await fastify.db.users.findMany();

  for (let i = 0; i < users.length; i++) {
    const user: UserEntityWithRelations = users[i];

    user.posts = await fastify.db.posts.findMany({
      key: 'userId',
      equals: user.id,
    });

    const profile = await fastify.db.profiles.findOne({
      key: 'userId',
      equals: user.id,
    });

    if (profile) {
      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: profile?.memberTypeId,
      });

      user.profile = { ...profile, memberType };
    }

    users[i] = user;
  }

  return users;
};
