import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

export type ProfileWithMemberTypeEntity = ProfileEntity & {
  memberType: MemberTypeEntity | null;
};

export type UserEntityWithRelations =
  | (UserEntity & {
      posts?: PostEntity[];
      profile?: ProfileWithMemberTypeEntity;
    })
  | null;
