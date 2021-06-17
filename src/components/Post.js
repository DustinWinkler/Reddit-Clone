import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import Comments from './Comments'

// add comments, cheeck react docs

function Post(props) {
  let {path, url} = useRouteMatch

  return (
    <div className="p-2 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      <p>Posted by <span className="text-blue-400">{props.post.author}</span>  in r/{props.post.subreddit}</p>
      <h1 className="text-lg">{props.post.title}</h1>
      <p>{props.post.content}</p>
      {props.comments === 'disabled' ? "" :
      <Link className="hover:text-blue-500" to={"/" + props.post.subreddit + "/comments/" + props.post.id } >(NUMBER) Comments</Link>}
    </div>
  )
}

export default Post
