import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { getTopLevelCommentIDs, getChildComments } from "../API/comments"
import { getPost } from "../API/posts"
import Post from './Post'

//need form at the top 
// below list all comments on props.post

function Comments(props) {
  const [post, setPost] = useState({})
  const [loadingPost, setLoadingPost] = useState(true)
  const [postID, setPostID] = useState(useParams().postid)
  const [subreddit, setSubreddit] = useState(useParams().subreddit)

  useEffect(() => {
    getPost(postID).then(post => {
      setPost(post)
      setLoadingPost(false)
    })
  }, [])

  useEffect(() => {
    getTopLevelCommentIDs(postID)
  }, [])



  //Need to render Post from postid ^^

  return (
    <div className="w-3/5 mx-auto m-2 justify-space-around bg-white">
      <div>
        { loadingPost ? "loading post" :
          <Post post={post} />}
      </div>

      <div className="flex">
        <form className="relative border border-gray-400 w-full mr-2">
          <textarea className="w-full" placeholder="Write your comment." />
          <input className="absolute bottom-0 right-0 text-center border-2 border-blue-500 w-36 rounded-lg" value="Post Comment" type="submit" /> 
        </form>

        <div className="w-2/5 h-1/5 border">
          {`r/${subreddit}`}
        </div>
      </div>

      This is the comments component
    </div>
  )
}

export default Comments
