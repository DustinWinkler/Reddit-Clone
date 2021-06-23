import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Votes from './Votes'
import {LoggedInContext} from '../App'
import { getTotalComments } from '../API/comments'

function Post(props) {
  const [commentCount, setCommentCount] = useState(0)

  const loggedIn = useContext(LoggedInContext)

  const history = useHistory()

  const commentsLink = () => {
    history.push('/' + props.post.subreddit + '/comments/' + props.post.id);
  }

  getTotalComments(props.post.id).then(count => setCommentCount(count))

  return (
    <div className="p-2 my-3 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      <p>Posted by <span className="text-blue-400">{props.post.author}</span>  in r/{props.post.subreddit}</p>
      <h1 className="text-lg">{props.post.title}</h1>
      <p>{props.post.content}</p>
      {props.comments === 'disabled' ? "" :
      <Link className="text-sm hover:underline hover:text-blue-500" to={"/" + props.post.subreddit + "/comments/" + props.post.id } >{commentCount} Comments</Link>}
      <Votes type="post" content={props.post} replyFunc={commentsLink} loggedIn={loggedIn} />
    </div>
  )
}

export default Post
