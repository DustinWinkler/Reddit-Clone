interface Post {
  author: string
  comments: string[]
  content: string | File
  subreddit: string
  title: string
  type: string
  votes: number
  id?: string
}

interface Comment {
  author: string
  comments: string[]
  content: string
  votes: number
  id?: string
}

interface Subreddit {
  description: string
}

interface User {
  downvotedIDs: string[]
  password: string
  posts: string[]
  upvotedIDs: string[]
  username?: string
}

// need user, post pre/post id, ...

export type {Post, Comment, Subreddit, User }