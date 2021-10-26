import { useMutation, useQuery } from '@apollo/client'
import React, { useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import { LoggedInContext } from '../App'
import { CREATE_COMMENT } from '../GraphQL/mutations'
import { POST, SUBREDDIT } from '../GraphQL/queries'
import Comment from './Comment'
import LoadingIcon from './LoadingIcon'
import PostCard from './PostCard'

function Post() {
  const [formContent, setFormContent] = useState<string>('')

  const loggedIn = useContext(LoggedInContext)

  const params = useParams<{postid:string, subredditid:string}>()
  const postID = params.postid
  const subredditID = params.subredditid
  console.log(postID);
  
  const { loading, error, data } = useQuery(POST, {
    variables: { ID: postID },
    onCompleted: ({ post }) => {console.log(data);
    }
  })

  const {
    loading: subredditLoading,
    error: subredditError,
    data: subredditData
  } = useQuery(SUBREDDIT, {
    variables: {
      ID: subredditID
    },

  })

  const [createComment, {error: createCommentError}] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      "getPost",
      "getComment"
    ]
  })

  function handleChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setFormContent(target.value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!loggedIn) {
      alert("You must be logged in to comment.")
      return
    }

    setFormContent('')



    let comment = {
      content: formContent,
    }
    
    createComment({
      variables: {
        commentInfo: comment,
        parentID: postID as string,
        parentType: "post"
      }
    })
  }

  return (
    <div className="w-full px-4 sm:w-10/12 xl:w-3/5 p-2 mx-auto justify-space-around bg-white striped">
      <div className="flex flex-col my-2 lg:flex-row items-start justify-between">
        <div className="w-full lg:w-3/5 mr-2">
          { loading && <LoadingIcon /> }
          { data && <PostCard post={data?.post}  commentsEnabled={false} />}
            
          { error && <p>There was an error loading the post</p>}
        </div>

          {subredditLoading && !subredditError ? <LoadingIcon /> :
            <div className="border w-full h-auto lg:w-2/5 p-2 bg-white rounded-lg hover:border-gray-400 shadow-lg">
              <p className="text-center text-2xl font-bold p-1">
                {`r/${subredditData?.subreddit.title}`}
              </p>
              <p>
                {subredditData?.subreddit.description}
              </p>
            </div> 
            
          }

          {subredditError && <p>There was an error loading the subreddit</p>}

      </div>

      <div className="flex w-full">
        <form className="w-full mr-2" onSubmit={handleSubmit}>
          <textarea className="w-full p-3 border rounded-xl" rows={4} placeholder="Write your comment." value={formContent} onChange={handleChange} />
          <input className="w-max min-w-px mx-auto py-0 px-3 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" value="Post Comment" type="submit" /> 
        </form>
        {createCommentError && <p>There was an error creating your comment</p>}
      </div>

      <div className="w-full pr-2">
        {loading ? <LoadingIcon/> : 
        data?.post.comments.map((commentID: string, i:string) => {
          return <Comment key={i} commentID={commentID} />
        })}
      </div>

    </div>
  )
}

export default Post
