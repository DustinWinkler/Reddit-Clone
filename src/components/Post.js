import React, { useState, useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Votes from './Votes'
import {LoggedInContext} from '../App'
import { getTotalComments } from '../API/comments'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function Post(props) {
  const [commentCount, setCommentCount] = useState(0)
  const [canDelete, setCanDelete] = useState(false)

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

    console.log("username in canDelete -> ", username)
    console.log("author in canDelete -> ", author)
    console.log("username === author ? ", username === author)

  }, [])

  // get total comments for post preview i.e (4 comments)
  useEffect(() => {
    getTotalComments(props.post.id).then(count => setCommentCount(count))
  }, [])

  const loggedIn = useContext(LoggedInContext)

  const history = useHistory()

  const commentsLink = () => {
    history.push('/' + props.post.subreddit + '/comments/' + props.post.id);
  }

  function deletePost() {
    if (window.confirm("meme?")) {
      console.log("meme")
    }
  }


  return (
    <div className="relative z-0 p-2 my-3 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      {canDelete ? <div onClick={deletePost} className="absolute top-2 right-5 fill-current text-red-600 cursor-pointer"> 
        <FontAwesomeIcon icon={faTrash} /> 
      </div> : ""}

      <p>{"Posted by "}
      <Link to={"/users/" + props.post.author}>
        <span className="text-blue-400 hover:underline">{props.post.author}</span>
      </Link>  in r/{props.post.subreddit}</p>

      <h1 className="text-lg">{props.post.title}</h1>
      <p>{props.post.content}</p>
      {props.comments === 'disabled' ? "" :
      <Link className="text-sm hover:underline hover:text-blue-500" to={"/" + props.post.subreddit + "/comments/" + props.post.id } >{commentCount} Comments</Link>}
      <Votes type="post" content={props.post} replyFunc={commentsLink} loggedIn={loggedIn} />
    </div>
  )
}

export default Post
