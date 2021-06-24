import React, { useState, useEffect, useContext } from 'react'
import { useParams } from "react-router-dom"
import {LoggedInContext} from "../App"
import { getTopLevelCommentIDs, getChildComments, getComment, createComment } from "../API/comments"
import { getPost } from "../API/posts"
import { getSubredditInfo } from "../API/subreddits"
import Comment from './Comment'
import LoadingIcon from './LoadingIcon'
import Post from './Post'

//need form at the top 
// below list all comments on props.post

function Comments(props) {
  const [post, setPost] = useState({})
  const [loadingPost, setLoadingPost] = useState(true)
  const [subInfo, setSubInfo] = useState('')
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentIDs, setCommentIDs] = useState([])
  const [comments, setComments] = useState([])
  const [formContent, setFormContent] = useState('')

  const postID = useParams().postid
  const subreddit = useParams().subreddit

  const loggedIn = useContext(LoggedInContext)


  useEffect(() => {
    getPost(postID).then(post => {
      setPost(post)
      setLoadingPost(false)
    })

    getSubredditInfo(subreddit).then(info => {
      setSubInfo(info)
    })
  }, [])

  useEffect(() => {
    getTopLevelCommentIDs(postID).then(ids => {
      let incomingIDs = []
      ids.forEach(id => incomingIDs.push(id))
      setCommentIDs(incomingIDs)
    })
  }, [])

  // when we get ids populate comments state with getComment for each id
  useEffect(() => {
    let promises = []

    commentIDs.forEach(id => {
      promises.push(new Promise(resolve => resolve(getComment(id))))
    })

    Promise.all(promises).then(comments => {
      setComments(comments.sort((a, b) => b.votes - a.votes))
      setLoadingComments(false)
    })
  }, [commentIDs])

  function handleChange(e) {
    setFormContent(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!loggedIn) {
      alert("You must be logged in to comment.")
      return
    }

    setFormContent('')

    let comment = {
      content: formContent,
      comments: [],
      author: localStorage.getItem("curr_user"),
      votes: 0
    }

    let oldComments = comments
    oldComments.push(comment)
    setComments(oldComments)

    createComment(comment, postID)

    // add new Comment object to children
    
    // send identical object to DB
  }

  return (
    <div className="w-3/5 mx-auto m-2 justify-space-around bg-white striped">
      
      <div className="flex justify-between">
        <div className="w-3/5 m-1">
          { loadingPost ? "loading post" :
            <Post post={post} comments="disabled" />}
        </div>

        <div className="border w-2/5 p-2 bg-white rounded-lg mt-1 hover:border-gray-400 shadow-lg">
          <p className="text-center p-1">
          {`r/${subreddit}`}
          </p>
          {subInfo}
        </div>
      </div>

      <div className="flex w-3/5">
        <form className="w-full mr-2" onSubmit={handleSubmit}>
          <textarea className="w-full p-3 border rounded-xl" rows="4" placeholder="Write your comment." value={formContent} onChange={handleChange} />
          <input className="w-max mx-auto py-0 px-3 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" value="Post Comment" type="submit" /> 
        </form>
      </div>

      <div>
        {loadingComments ? <LoadingIcon/> : 
        comments.map(comment => {
          return <Comment loggedIn={props.loggedIn} key={comment.id} comment={comment} />
        })}
      </div>

    </div>
  )
}

export default Comments
