import React, { useState, useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Votes from './Votes'
import {LoggedInContext} from '../App'
import { getTotalComments } from '../API/comments'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { deletePost } from '../API/posts'

function Post(props) {
  const [commentCount, setCommentCount] = useState(0)
  const [canDelete, setCanDelete] = useState(false)
  const [content, setContent] = useState('')
  const [loadingContent, setLoadingContent] = useState(true)

  // check canDelete status
  useEffect(() => {
    let username = localStorage.getItem("curr_user")
    let author = props.post.author

    if (username === null) {return}

    if (username === author) {
      setCanDelete(true)
    }

    if (username.includes("admin")) {
      setCanDelete(true)
    }

  }, [])

  // get total comments for post preview i.e (4 comments)
  useEffect(() => {
    if (!props.comments === 'disabled') {
      getTotalComments(props.post.id).then(count => setCommentCount(count))
    }
  }, [])

  // check content type, if file, get it and set loading false
  useEffect(() => {
    
  }, [])

  const loggedIn = useContext(LoggedInContext)

  const history = useHistory()

  const commentsLink = () => {
    history.push('/' + props.post.subreddit + '/comments/' + props.post.id);
  }

  function compDeletePost() {
    if (window.confirm("Are you sure you would like to delete this post?")) {
      deletePost(props.post.id)
      console.log("post deleted")
      setTimeout(()=>{window.location.reload()}, 1000)
    }
  }


  return (
    <div className="relative z-0 p-2 my-3 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      {canDelete ? <div onClick={compDeletePost} className="absolute top-2 right-5 fill-current text-red-600 cursor-pointer"> 
        <FontAwesomeIcon icon={faTrash} /> 
      </div> : ""}

      <p>{"Posted by "}
      <Link to={"/users/" + props.post.author}>
        <span className="text-blue-400 hover:underline">{props.post.author}</span>
      </Link>  {"in "}
      <Link to={"/" + props.post.subreddit}>
        <span className="text-blue-400 hover:underline">r/{props.post.subreddit}</span>
      </Link>
      </p>

      <h1 className="text-lg">{props.post.title}</h1>
      <p>{props.post.content}</p>
      {props.comments === 'disabled' ? "" :
      <Link className="text-sm hover:underline hover:text-blue-500" to={"/" + props.post.subreddit + "/comments/" + props.post.id } >{commentCount} Comments</Link>}
      <Votes type="post" content={props.post} replyFunc={commentsLink} loggedIn={loggedIn} />
    </div>
  )
}

export default Post
