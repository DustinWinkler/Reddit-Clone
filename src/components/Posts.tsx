import React, { FC } from 'react'
import LoadingIcon from './LoadingIcon';
import { useQuery } from '@apollo/client';
import { POSTS_FOR_HOME, POSTS_FOR_SUBREDDIT } from '../GraphQL/queries';
import { PostInterface } from '../TS/interfaces';
import PostCard from './PostCard';

type PostsProps = {
	subredditID: string
}
 
const Posts:FC<PostsProps> = ({ subredditID: ID }) => {

	const query = (ID === undefined ? 
		POSTS_FOR_HOME :
		POSTS_FOR_SUBREDDIT
	)

	const { loading, error, data } = useQuery(query, {
		variables: {
			ID
		}
	})

	const rAllPostingDisclaimer = (
		<p className="w-full px-4 sm:w-10/12 xl:w-3/5 bg-white mx-auto text-center -mt-2 mb-2 p-1 text-xs font-bold">
			You can create your own posts by going to the subreddit you would like to post in.
		</p>
	)

  return (
    <div className="relative z-0 mt-4 px-4 w-11/12 sm:w-10/12 lg:w-3/5 mx-auto p-2 striped">
			{ID ? rAllPostingDisclaimer : ''}

			{ !!error && <p>Error: {error.message}</p>}

      { (loading && !error) ? <LoadingIcon/> :
			data?.postsForHome.map((post: PostInterface) => {
				return (
					<PostCard commentsEnabled={true} key={post.id} post={post} />
				)
      })}
    </div>
  )
}

export default Posts
