interface PostInterface {
  author: string
  comments: string[]
  content: string
  subreddit: string
  title: string
  type: string
  votes: number
  id: string
}

interface CommentInterface {
  author: string
  comments: string[]
  content: string
  votes: number
  id: string
}

interface SubredditInterface {
  description: string,
  id: string
}

interface UserInterface {
  downvotedIDs: string[]
  password: string
  posts: string[]
  upvotedIDs: string[]
  username: string
}

// need user, post pre/post id, ...

export type {PostInterface, CommentInterface, SubredditInterface, UserInterface }