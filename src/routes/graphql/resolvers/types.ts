import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

export type ProfileWithMemberTypeEntity = ProfileEntity & {
  memberType: MemberTypeEntity | null;
};

type UserRelations = {
  posts?: PostEntity[];
  profile?: ProfileWithMemberTypeEntity;
};

export type UserEntityWithRelations = (UserEntity & UserRelations) | null;

export type UserEntityWithSubscriptions = UserEntity & {
  profile?: ProfileEntity;
  userSubscribedTo?: string[];
  subscribedToUser?: string[];
};
