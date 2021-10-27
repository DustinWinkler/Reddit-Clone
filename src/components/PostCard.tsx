import React, { useState, useEffect, ReactElement, FC } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Votes from './Votes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import LoadingIcon from './LoadingIcon'
import { useMutation, useQuery } from '@apollo/client'
import { PostInterface } from '../TS/interfaces'
import { CURRENT_USER_DETAILS } from '../GraphQL/queries'
import { DELETE_POST } from '../GraphQL/mutations'

type PostCardProps = {
  post: PostInterface
  commentsEnabled: boolean
}

const PostCard: FC<PostCardProps> = ({ post, commentsEnabled }) => {
  const [canDelete, setCanDelete] = useState(false)
  const [content, setContent] = useState<ReactElement>()
  const [loadingContent, setLoadingContent] = useState(true)
  const screenWidth = window.innerWidth as number  

  const { data: userData } = useQuery(CURRENT_USER_DETAILS, {
    fetchPolicy: "network-only"
  })  

  const [deletePost, {
    loading: deletePostLoading,
    error: deletePostError,
    //data: deletePostData
  }] = useMutation(DELETE_POST, {
    refetchQueries: [
      "getPostsForHome",
      "getPostsForUser",
      "getPostsForSubreddit"
    ]
  })

  // check canDelete status
  useEffect(() => {    
    if (userData === undefined || userData.currentUserDetails === null) {
      setCanDelete(false)
      return
    }
    let user = userData?.currentUserDetails.id || undefined
    let author = post?.author.id

    if ((user === author) && user) {
      setCanDelete(true)
    } else {
      setCanDelete(false)
    }

  }, [post, userData])

  // check content type, if file, get it and set loading false
  useEffect(() => {
    if (!post) return
    async function getYTAspectRatio(videoID: string) {
      let height: number = 0
      let width: number = 0
      let maxWidth = 0
  
      if (screenWidth < 1024) {
        maxWidth = (commentsEnabled ? screenWidth * 0.7 : screenWidth * 0.7)
      } else {
        maxWidth = (commentsEnabled ? screenWidth * 0.45 : screenWidth * 0.3)
      }
  
      await fetch("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + videoID)
        .then(resp => resp.json())
        .then(data => {
          height = data.height
          width = data.width
        })
       
  
      if ((21/9).toFixed(4) === (width/height).toFixed(4)) {
        // 21:9 ratio 
        return {
          height: maxWidth * (9/21), 
          width: maxWidth
        }
      }
      else if ((4/3).toFixed(4) === (width/height).toFixed(4)) {
        // 4:3 ratio
        return {
          height: maxWidth * (3/4),
          width: maxWidth
        }
      }
  
      else {
        // 16:9 ratio for all else
        return {
          height: maxWidth * (9/16),
          width: maxWidth
        }
      }
    }

    if (post.type === "Text") {
      setContent(<p>{post.content}</p>)
      setLoadingContent(false)
    } 
    
    if (post.type === "Image") {
      setContent(<img className="p-2 mx-auto max-w-1/2" src={post.fileURL} alt="user uploaded" />)
      setLoadingContent(false)
    }

    if (post.type === "Video") {
      setContent(
        <div className="w-48 mx-auto">
          <video controls height="200" width="200" className="mx-auto" src={post.fileURL} />
        </div>
      )
      setLoadingContent(false)
    }

    if (post.type === "Link") {
      if(post.content.includes("youtu")) {
        let videoID = YouTubeGetID(post.content)
        getYTAspectRatio(videoID).then(obj => {
          setContent(<iframe className="mx-auto" width={obj.width} height={obj.height} title="YT video" src={"https://www.youtube.com/embed/" + videoID}></iframe>)
        })
        
      } else {
        setContent(<a className="block hover:text-blue-400" target="_blank" rel="noreferrer" href={post.content}>{post.content}</a>)
      }
      setLoadingContent(false)
    }
  }, [post, commentsEnabled, screenWidth])

  const history = useHistory()

  const commentsLink = () => {
    history.push('/' + post.subreddit.id + '/comments/' + post.id);
  }

  function compDeletePost() {
    if (window.confirm("Are you sure you would like to delete this post?")) {
      deletePost({
        variables: {
          ID: post.id
        }
      })
    }
  }

  function YouTubeGetID(url: string){
    let spliturl = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (spliturl[2] !== undefined) ? spliturl[2].split(/[^0-9a-z_-]/i)[0] : spliturl[0];
  }

  return (
    <div className="relative z-0 p-2 lg:p-3 mb-3 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      {canDelete && commentsEnabled ? <div onClick={compDeletePost} className="absolute top-2 right-5 fill-current text-red-600 cursor-pointer"> 
        <FontAwesomeIcon icon={faTrash} /> 

        {deletePostError && <p>There was an error deleting this post</p>}

         {deletePostLoading && <LoadingIcon />}
      </div> : ""}

      <p className="hidden">{screenWidth}</p>

      <p className="text-sm">{"Posted by "}
      <Link to={"/users/" + post.author.id}>
        <span className="text-blue-400 hover:underline">{post.author.username}</span>
      </Link>  {"in "}
      <Link to={"/" + post.subreddit.id}>
        <span className="text-blue-400 hover:underline">r/{post.subreddit.title}</span>
      </Link>
      </p>

      <h1 className="text-xl my-1 font-bold">{post.title}</h1>
      {loadingContent ? <LoadingIcon /> : content}
      {commentsEnabled ?
      <Link className="text-sm hover:underline hover:text-blue-500" to={"/" + post.subreddit.id + "/comments/" + post.id } >{post.totalComments} {
      post.totalComments === 1 ? "Comment" : "Comments"

      }</Link> : ""}
      <Votes content={post} replyFunc={commentsLink} />
    </div>
  )
}

export default PostCard
