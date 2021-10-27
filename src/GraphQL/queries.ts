import { gql } from "@apollo/client"

// home page
const POSTS_FOR_HOME = gql`
  query getPostsForHome {
  postsForHome {
    title
    content
    author {
      username
      id
    }
    comments
    subreddit {
      id
      title
    }
    votes
    type
    totalComments
    fileURL
    id
  }
}
`

const POSTS_FOR_USER = gql`
  query getPostsForUser($ID: ID) {
  postsForUser(ID: $ID) {
    title
    content
    author {
      username
      id
    }
    comments
    subreddit {
      title
      id
    }
    votes
    type
    totalComments
    fileURL
    id
  }
}
`

// individual post page
const POST = gql`
  query getPost($ID: ID) {
  post(ID: $ID) {
    title
    content
    author {
      username
      id
    }
    comments
    subreddit {
      id
      title
    }
    votes
    type
    fileURL
    id
  }
}
`

// posts for individual subreddit
const POSTS_FOR_SUBREDDIT = gql`
  query getPostsForSubreddit($ID: ID) {
    postsForSubreddit(ID: $ID) {
      title
      content
      author {
        username
        id
      }
      comments
      subreddit {
        title
        id
      }
      votes
      type
      totalComments
      fileURL
      id
    }
  }
`

// nested comments fetching
const COMMENT = gql`
  query getComment($ID: ID) {
    comment(ID: $ID) {
      content
      author {
        username
        id
      }
      comments
      votes
      id
    }
  }
`

// full subreddit list
const SUBREDDITS = gql`
  query getSubreddits {
    subreddits {
      title
      description
      id
    }
  }
`

const SUBREDDIT = gql`
  query getSubreddit($ID: ID) {
    subreddit(ID: $ID) {
      description
      title
      id
    }
  }
`

const USER_DETAILS = gql`
  query userDetails($ID: ID) {
    userDetails(ID: $ID) {
      id
      username
    }
  }
`

const CURRENT_USER_DETAILS = gql`
  query currentUserDetails {
    currentUserDetails {
      username
      id
      downvotedIDs
      upvotedIDs
    }
  }
`

export { POSTS_FOR_HOME, POSTS_FOR_USER, POSTS_FOR_SUBREDDIT, POST, COMMENT, SUBREDDITS, SUBREDDIT, USER_DETAILS, CURRENT_USER_DETAILS }