import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import Comments from './Comments'

// add comments, cheeck react docs

function Post(props) {
  let {path, url} = useRouteMatch

  return (
    <div className="w-1/2 p-2 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      <p>Posted by {props.post.author} in r/(ADDSUBREDDITTOPOSTS)</p>
      <h1 className="text-lg">{props.post.title}</h1>
      <p>{props.post.content}</p>
      <Link className="hover:text-blue-500" to={"/" + props.post.subreddit + "/comments/" + props.post.id } >(NUMBER) Comments</Link>
    </div>
  )
}

export default Post
