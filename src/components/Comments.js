import React from 'react'
import { useParams } from "react-router-dom"

//need form at the top 
// below list all comments on props.post

function Comments(props) {

  let postID = useParams().postid
  let subreddit = useParams().subreddit

  //Need to render Post from postid ^^

  return (
    <div className="w-3/5 mx-auto m-2 justify-space-around bg-white">
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
