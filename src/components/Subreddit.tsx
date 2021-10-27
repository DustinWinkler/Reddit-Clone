import React from 'react'
import { useParams } from "react-router-dom"
import LoadingIcon from './LoadingIcon'
import PostForm from './PostForm'
import { useQuery } from '@apollo/client'
import { SUBREDDIT, POSTS_FOR_SUBREDDIT } from '../GraphQL/queries'
import { PostInterface } from '../TS/interfaces'
import PostCard from './PostCard'

function Subreddit() {
  const subreddit = useParams<{subreddit: string}>().subreddit

  const { loading: subredditLoading, error: subredditError, data: subredditData } = useQuery(SUBREDDIT, {variables: {ID: subreddit}})

  const { 
    loading: postsLoading,
    error: postsError,
    data: postsData
  } = useQuery(POSTS_FOR_SUBREDDIT, {
    variables: {
      ID: subreddit
    },
    onCompleted: () => {console.log('meme');
    }
  })  

  return (
    
    <div>
      {subredditLoading && !subredditError ?
        <LoadingIcon /> :
        (
          <div>
            <header className="text-3xl font-bold mx-auto w-11/12 sm:w-10/12 lg:w-3/5 text-center my-2 bg-white rounded-lg py-1 bg-opacity-70 border border-gray-400">
              r/{subredditData?.subreddit.title}
            </header>

            <div className="p-1 w-11/12 sm:w-10/12 lg:w-3/5 mx-auto text-center">
              <p className="py-1 px-4 bg-white mx-auto border border-gray-400 rounded ">{subredditData?.subreddit.description}</p>
            </div>
          </div>
        )
      }

      {subredditError && (
        <div>There was an error loading the subreddit info</div>
      )}

      <PostForm subreddit={subreddit} />

    <div className="transition-all duration-500 mx-auto w-11/12 sm:w-10/12 lg:w-3/5 px-2">
      {postsLoading && <LoadingIcon /> }
      
      {!!postsError && <div>There was an error loading these posts</div>}

      {postsData?.postsForSubreddit.map((post: PostInterface) => {return <PostCard commentsEnabled={true} key={post.id} post={post} />})}
    </div>

    </div>
  )
}

export default Subreddit
