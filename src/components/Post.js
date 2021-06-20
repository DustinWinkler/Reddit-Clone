import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Votes from './Votes'
import {LoggedInContext} from '../App'

function Post(props) {
  const loggedIn = useContext(LoggedInContext)
  console.log("post useContext loggedIn status -> ", loggedIn)

  const history = useHistory()

  const commentsLink = () => {
    history.push('/' + props.post.subreddit + '/comments/' + props.post.id);
  }

  return (
    <div className="p-2 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      <p>Posted by <span className="text-blue-400">{props.post.author}</span>  in r/{props.post.subreddit}</p>
      <h1 className="text-lg">{props.post.title}</h1>
      <p>{props.post.content}</p>
      {props.comments === 'disabled' ? "" :
      <Link className="hover:text-blue-500" to={"/" + props.post.subreddit + "/comments/" + props.post.id } >(NUMBER) Comments</Link>}
      <Votes type="post" content={props.post} replyFunc={commentsLink} loggedIn={loggedIn} />
    </div>
  )
}

export default Post
