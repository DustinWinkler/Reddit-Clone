import { gql } from "@apollo/client"

const LOGIN = gql`
  mutation login($loginInfo: LoginInfo!) {
    login(loginInfo: $loginInfo) {
      token
      success
      errors {
        message
      }
    }
  }
`

const SIGNUP = gql`
  mutation signup($signupInfo: LoginInfo!) {
    signup(signupInfo: $signupInfo) {
      success
      token
      errors {
        message
      }
    }
  }
`

const CREATE_POST = gql`
  mutation createPost($postInfo: PostInfo!) {
    createPost(postInfo: $postInfo) {
      title
      content
      author {
        id
        username
      }
      subreddit {
        title
        id
      }
      totalComments
      fileURL
      id
    }
  }
`

const CREATE_COMMENT = gql`
  mutation createComment($commentInfo: CommentInfo!, $parentID: ID, $parentType: CommentParents) {
    createComment(commentInfo: $commentInfo, parentID: $parentID, parentType: $parentType) {
      content
      author {
        id
        username
      }
      comments
      votes
      id
    }
  }
`

const CREATE_SUBREDDIT = gql`
  mutation createSubreddit($subredditInfo: SubredditInfo!) {
    createSubreddit(subredditInfo: $subredditInfo) {
      title
      description
      id
    }
  }
`

const UPDATE_POST = gql`
  mutation updatePost($postObject: PostInfo) {
    updatePost(postObject: $postObject) {
      title
      content
      author {
        username
        id
      }
      subreddit {
        title
        id
      }
      totalComments
      fileURL
      id
    }
  }
`

const UPDATE_COMMENT = gql`
  mutation updateComment($commentObject: CommentInfo!) {
    updateComment(commentObject: $commentObject) {
      content
      author {
        username
        id
      }
      votes
      id
      comments
    }
  }
`

const DELETE_POST = gql`
  mutation deletePost($ID: ID) {
    deletePost(ID: $ID) {
      success
      message
    }
  }
`

const DELETE_COMMENT = gql`
  mutation deleteComment($ID: ID) {
    deleteComment(ID: $ID) {
      success
      message
    }
  }
`

const UPVOTE_ITEM = gql`
  mutation upvote($ID: ID) {
    upvoteItem(ID: $ID) {
      newToken
      success
      message
    }
  }
`

const DOWNVOTE_ITEM = gql`
  mutation downvote($ID: ID) {
    downvoteItem(ID: $ID) {
      newToken
      success
      message
    }
  }
`

export { LOGIN, SIGNUP, CREATE_POST, CREATE_COMMENT, CREATE_SUBREDDIT, UPDATE_POST, UPDATE_COMMENT, DELETE_POST, DELETE_COMMENT, UPVOTE_ITEM, DOWNVOTE_ITEM }