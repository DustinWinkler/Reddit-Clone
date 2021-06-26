import React, { useState,useEffect } from 'react'
import Post from "./Post";
import { getPosts } from '../API/posts'
import LoadingIcon from './LoadingIcon';

//receive 'all' or subreddit name and create a Post for each post in given sub
 
function Posts(props) {
  const [posts, setPosts] = useState([])
	const [subreddit, setSubreddit] = useState('')
	const [loadingPosts, setLoadingPosts] = useState(true)
	const [postType, setPostType] = useState('text')
	

	// set subreddit then getposts
	useEffect(() => {
		if (!props.subreddit || props.subreddit === 'all') {
			setSubreddit('all')
		} else {
			setSubreddit(props.subreddit)
		}
	}, [])

	useEffect(() => {
		getPosts(subreddit).then(val => {
			setPosts(val)
			setTimeout(setLoadingPosts(false), 500)
		})
	}, [subreddit])

	const rAllPostingDisclaimer = (
		<p className="w-max mx-auto bg-white text-center -my-2 p-1 text-xs font-bold">
			You can create your own posts by going to the subreddit you would like to post in.
		</p>
	)

  return (
    <div className="relative z-0 mt-4 w-3/5 mx-auto striped">
			{subreddit === 'all' || '' ? rAllPostingDisclaimer : ''}

      { loadingPosts ? <LoadingIcon/> :
			posts.map(post => {return (<Post key={post.id} post={post} />)
      })}
    </div>
  )
}

export default Posts
