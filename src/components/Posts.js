import React from 'react'
import Post from "./Post";

//receive 'all' or subreddit name and create a Post for each post in given sub
 
function Posts(props) {
  let posts = []

  if (!props.subreddit || props.subreddit === 'all') {
    posts = require("../test-server.json").posts
  } else {
    // posts = getPosts(props.subreddit)
  }

  console.log(posts)

  return (
    <div className="mt-4 w-3/5 mx-auto">
      {posts.map(post => {
        return (
          <Post post={post} />
        )
      })}
    </div>
  )
}

export default Posts
