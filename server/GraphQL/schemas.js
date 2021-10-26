import { gql } from 'apollo-server-express'

const Schemas = gql`
  type Query {
    postsForHome: [Post!]!
    postsForUser(ID: ID): [Post!]!
    postsForSubreddit(ID: ID): [Post!]!
    post(ID: ID): Post!
    comment(ID: ID): Comment!
    subreddits: [Subreddit!]!
    subreddit(ID: ID): Subreddit!
    userDetails(ID: ID): UserDetails
    currentUserDetails: UserDetails
  }

  type Mutation {
    login(loginInfo: LoginInfo!): AuthPayload!
    signup(signupInfo: LoginInfo!): AuthPayload!
    createPost(postInfo: PostInfo!): Post!
    createComment(commentInfo: CommentInfo!, parentID: ID, parentType: CommentParents): Comment!
    createSubreddit(subredditInfo: SubredditInfo!): Subreddit!
    updatePost(postObject: PostInfo): Post!
    updateComment(commentObject: CommentInfo!): Comment!
    deletePost(ID: ID): DeleteResponse!
    deleteComment(ID: ID): DeleteResponse!
    upvoteItem(ID: ID): VoteReturn
    downvoteItem(ID: ID): VoteReturn
  }

  type Post {
    title: String!
    content: String!
    author: User
    comments: [ID]!
    subreddit: Subreddit!
    type: PostType!
    timestamps: Timestamps!
    totalComments: Int
    fileURL: String
    id: ID
    votes: Int
  }

  type Comment {
    content: String!
    author: User
    comments: [String]
    votes: Int!
    timestamps: Timestamps!
    id: ID
  }

  type Subreddit {
    title: String!
    description: String!
    id: ID
  }

  type User {
    username: String!
    upvotedIDs: [String!]!
    downvotedIDs: [String!]!
    id: ID
  }

  input LoginInfo {
    username: String!
    password: String!
  }

  input PostInfo {
    title: String!
    content: String!
    subreddit: ID
    type: PostType
    fileURL: String
  }

  input CommentInfo {
    content: String!
  }

  input SubredditInfo {
    description: String
    title: String!
  }

  type Timestamps {
    createdAt: String
    updatedAt: String
  }

  enum PostType {
    Link
    Image
    Video
    Text
  }

  enum CommentParents {
    post
    comment
  }

  input UserInfo {
    username: String!
    password: String!
  }

  type AuthPayload {
    success: Boolean!
    token: String
    errors: [Error]
    userDetails: UserDetails
  }

  type UserDetails {
    username: String!
    id: ID
    upvotedIDs: [String]
    downvotedIDs: [String]
  }

  type Error {
    message: String
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  type VoteReturn {
    newToken: String
    success: Boolean!
    message: String!
  }
`

export default Schemas 