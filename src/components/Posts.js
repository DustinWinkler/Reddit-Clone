import React, { useState,useEffect } from 'react'
import Post from "./Post";

//receive 'all' or subreddit name and create a Post for each post in given sub
 
function Posts(props) {
  const [posts, setPosts] = useState([])
	const [subreddit, setSubreddit] = useState('')
	const [postType, setPostType] = useState('text')
	
	useEffect(() => {
		if (!props.subreddit || props.subreddit === 'all') {
			setPosts(require("../test-server.json").posts)
			setSubreddit('all')
		} else {
			// setPosts(getPosts(props.subreddit))
			setSubreddit(props.subreddit)
		}
		
	}, [])



  

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
