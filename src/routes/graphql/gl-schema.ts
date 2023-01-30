import { buildSchema } from 'graphql/index';

export const schema = buildSchema(`
  type MemberType {
    id: ID!
    discount: Int!,
    monthPostsLimit: Int!,
  }

  type Post {
    content: String!
    id: ID!
    title: String!
    userId: String!
  }

  interface Profile {
    avatar: String!
    birthday: Int!
    city: String!
    country: String!
    id: ID!
    memberTypeId: String!
    sex: String!
    street: String!
    userId: String!
  }
  
  type ProfileWithMemberType implements Profile {
    avatar: String!
    birthday: Int!
    city: String!
    country: String!
    id: ID!
    memberTypeId: String!
    sex: String!
    street: String!
    userId: String!
    memberType: MemberType
  }

  interface User {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
  }
  
  type UserWithRelations implements User {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
    posts: [Post]
    profile: ProfileWithMemberType
  }
  
  type UserWithSubscriptionsAndProfile implements User {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
    userSubscribedTo: [String]
    profile: Profile
  }
  
  type UserByIdWithSubscribersAndPosts implements User {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
    subscribedToUser: [String]
    posts: [Post]
  }
  
  type Entities {
    memberTypes: [MemberType!]!
    posts: [Post!]!
    profiles: [Profile!]!
    users: [User!]!
  }
  
  type Entity {
    user: User
    profile: Profile
    post: Post
    memberType: MemberType
  }

  type Query {
    entities: Entities!
    entityById(id: ID!): Entity!
    users: [UserWithRelations]!
    user(id: ID!): UserWithRelations
    usersWithSubscriptionsAndProfiles: [UserWithSubscriptionsAndProfile]
    userByIdWithSubscribersAndPosts(id: ID!): UserByIdWithSubscribersAndPosts
  }
`);
