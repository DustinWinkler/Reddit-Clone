import React, { useState, useEffect, useContext } from 'react'
import { useParams } from "react-router-dom"
import {LoggedInContext} from "../App"
import { getTopLevelCommentIDs, getComment, createComment } from "../API/comments"
import { getPost } from "../API/posts"
import { getSubredditInfo } from "../API/subreddits"
import Comment from './Comment'
import LoadingIcon from './LoadingIcon'
import Post from './Post'
import { CommentInterface, PostInterface } from '../API/interfaces'

type CommentsParams = {
  postid: string,
  subreddit: string
}

function Comments() {
  const [post, setPost] = useState<PostInterface>()
  const [loadingPost, setLoadingPost] = useState<boolean>(true)
  const [subInfo, setSubInfo] = useState<string>('')
  const [loadingComments, setLoadingComments] = useState<boolean>(true)
  const [commentIDs, setCommentIDs] = useState<string[]>([])
  const [comments, setComments] = useState<CommentInterface[]>([])
  const [formContent, setFormContent] = useState<string>('')

  const params = useParams<CommentsParams>()
  const postID = params.postid
  const subreddit = params.subreddit

  const loggedIn = useContext(LoggedInContext)


  useEffect(() => {
    getPost(postID).then(post => {
      setPost(post)
      setLoadingPost(false)
    })

    getSubredditInfo(subreddit).then(info => {
      setSubInfo(info)
    })
  }, [postID, subreddit])

  useEffect(() => {
    getTopLevelCommentIDs(postID).then(ids => {
      let incomingIDs: string[] = []
      ids.forEach((id: string) => incomingIDs.push(id))
      setCommentIDs(incomingIDs)
    })
  }, [postID])

  // when we get ids populate comments state with getComment for each id
  useEffect(() => {
    let promises: Promise<CommentInterface>[] = []

    commentIDs.forEach(id => {
      promises.push(new Promise(resolve => resolve(getComment(id))))
    })

    Promise.all(promises).then(comments => {
      setComments(comments.sort((a, b) => b.votes - a.votes))
      setLoadingComments(false)
    })
  }, [commentIDs])

  function handleChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setFormContent(target.value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!loggedIn) {
      alert("You must be logged in to comment.")
      return
    }

    setFormContent('')

    let comment: CommentInterface = {
      content: formContent,
      comments: [],
      author: localStorage.getItem("curr_user") as string,
      votes: 0,
      id: 'temp'
    }

    let oldComments = comments
    oldComments.push(comment)
    setComments(oldComments)

    createComment(comment, postID)

    // add new Comment object to children
    
    // send identical object to DB
  }

  return (
    <div className="w-full lg:w-3/5 p-2 mx-auto justify-space-around bg-white striped">
      
      <div className="flex flex-col my-2 lg:flex-row items-start justify-between">
        <div className="w-full lg:w-3/5 mx-1">
          { loadingPost ? "loading post" :
            <Post post={post as PostInterface}  comments="disabled" />}
        </div>

        <div className="border w-full h-auto lg:w-2/5 p-2 bg-white rounded-lg hover:border-gray-400 shadow-lg">
          <p className="text-center text-2xl font-bold p-1">
          {`r/${subreddit}`}
          </p>
          {subInfo}
        </div>
      </div>

      <div className="flex w-full">
        <form className="w-full mr-2" onSubmit={handleSubmit}>
          <textarea className="w-full p-3 border rounded-xl" rows={4} placeholder="Write your comment." value={formContent} onChange={handleChange} />
          <input className="w-max min-w-px mx-auto py-0 px-3 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" value="Post Comment" type="submit" /> 
        </form>
      </div>

      <div className="w-full pr-2">
        {loadingComments ? <LoadingIcon/> : 
        comments.map(comment => {
          return <Comment key={comment.id} comment={comment} />
        })}
      </div>

    </div>
  )
}

export default Comments
