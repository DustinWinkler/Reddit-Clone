import { useQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { POSTS_FOR_USER, USER_DETAILS } from '../GraphQL/queries'
import { PostInterface } from '../TS/interfaces'
import LoadingIcon from './LoadingIcon'
import PostCard from './PostCard'

function UserProfile() {
  const ID = useParams<{userid: string}>().userid
  console.log('user profile userID',ID);
  
  const { loading, error, data } = useQuery(USER_DETAILS, {
    variables: {
      ID
    }
  })

  const { 
    loading: postsLoading,
    error: postsError,
    data: postsData 
  } = useQuery(POSTS_FOR_USER, {
    variables: {
      ID
    }
  })

  let content

  if (error) return <p>There was an error loading this user's profile</p>

  if (data && postsData?.postsForUser.length === 0) {
    content = "This user hasn't made any Posts"
  }

  return (
    <div className="w-full lg:w-3/5 mx-auto">
      
      {loading && <LoadingIcon /> }
      {!error &&
        <p className="my-4 mx-auto w-3/5 text-center text-2xl font-bold">This is {data?.userDetails.username}'s Profile</p>
      }
      

      {postsError && <p>There was an error loading this user's posts</p>}

      {postsLoading && !postsError ? <LoadingIcon /> : postsData?.postsForUser.map((post: PostInterface) => {return <PostCard commentsEnabled={true} key={post.id} post={post} />})}
      <p className="my-4 mx-auto w-3/5 text-center text-2xl font-bold">{content}</p>
    </div>
  )
}

export default UserProfile 