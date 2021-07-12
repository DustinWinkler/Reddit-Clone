import React, { useState,useEffect } from 'react'
import Post from "./Post";
import { getPosts } from '../API/posts'
import LoadingIcon from './LoadingIcon';
import { PostInterface } from '../API/interfaces';

type PostsProps = {
	subreddit: string
}
 
function Posts(props: PostsProps) {
  const [posts, setPosts] = useState<PostInterface[]>([])
	const [subreddit, setSubreddit] = useState<string>('')
	const [loadingPosts, setLoadingPosts] = useState<boolean>(true)
	
	// set subreddit then getposts
	useEffect(() => {
		if (!props.subreddit || props.subreddit === 'all') {
			setSubreddit('all')
		} else {
			setSubreddit(props.subreddit)
		}
	}, [props.subreddit])

	useEffect(() => {
		getPosts(subreddit).then(val => {
			setPosts(val)
			setTimeout(()=>{setLoadingPosts(false)}, 500)
		})
	}, [subreddit])

	const rAllPostingDisclaimer = (
		<p className="w-full lg:w-3/5 bg-white mx-auto text-center -mt-2 mb-2 p-1 text-xs font-bold">
			You can create your own posts by going to the subreddit you would like to post in.
		</p>
	)

  return (
    <div className="relative z-0 mt-4 w-full lg:w-3/5 mx-auto p-2 striped">
			{subreddit === 'all' || '' ? rAllPostingDisclaimer : ''}

      { loadingPosts ? <LoadingIcon/> :
			posts.map((post: PostInterface) => {return (<Post comments={"enabled"} key={post.id} post={post} />)
      })}
    </div>
  )
}

export default Posts
