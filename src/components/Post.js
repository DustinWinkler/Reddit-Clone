import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import Comments from './Comments'

// add comments, cheeck react docs

function Post(props) {
  let {path, url} = useRouteMatch

  return (
    <div className="w-1/2 p-2 border border-gray-200 hover:border-gray-400 rounded shadow-lg">
      <p>Author: {props.post.author}</p>
      <h1>{props.post.title}</h1>
      <p>{props.post.content}</p>
      <Link to={"/" + props.post.subreddit + "/comments/" + props.post.id } >Comments</Link>
    </div>
  )
}

export default Post
