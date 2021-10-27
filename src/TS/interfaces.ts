export interface UserInterface {
  username: string
  id: string
  upvotedIDs?: string[]
  downvotedIDs?: string[]
}

interface ShallowUser {
  id: string
}

export interface PostInterface {
  title: string
  content: string
  author: UserInterface
  subreddit: SubredditInterface
  type: PostType
  comments: string[]
  totalComments: number
  fileURL?: string
  id?: string
  votes: number
}

export enum PostType {
  text = "Text",
  link = "Link",
  video = "Video",
  image = "Image"
}

export interface SubredditInterface {
  title: string
  id: string
  description: string
}

export interface CommentInterface {
  content: string
  author: ShallowUser
  comments: string[]
  votes: number
  id?: string
}

export interface PostsData {
  posts: PostInterface[]
}

export interface PostData {
  post: PostInterface
}

export interface CommentData{
  comment: Comment
}

export interface SubredditsData{
  subreddits: SubredditInterface[]
}

export interface createPostInterface {
  title: string,
  content: string,
  subreddit: string,
  type: PostType,
  fileURL?: string
}

export interface SubredditData {
  subreddit: SubredditInterface
}