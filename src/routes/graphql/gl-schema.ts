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

  type Profile {
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
  
  type ProfileWithMemberType {
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

  type User {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
  }
  
  type UserWithRelations {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
    posts: [Post]
    profile: ProfileWithMemberType
  }
  
  type UserWithSubscriptionsAndProfile {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
    userSubscribedTo: [User]
    profile: Profile
  }
  
  type UserByIdWithSubscribersAndPosts {
    email: String
    firstName: String
    id: ID!
    lastName: String
    subscribedToUserIds: [String!]!
    subscribedToUser: [User]
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
