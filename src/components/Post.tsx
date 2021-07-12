import React, { useState, useContext, useEffect, ReactElement } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Votes from './Votes'
import {LoggedInContext} from '../App'
import { getTotalComments } from '../API/comments'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { deletePost, getFileUrl } from '../API/posts'
import LoadingIcon from './LoadingIcon'
import { PostInterface } from '../API/interfaces'

type PostProps = {
  post: PostInterface,
  comments: string
}

function Post(props: PostProps) {
  const [commentCount, setCommentCount] = useState(0)
  const [canDelete, setCanDelete] = useState(false)
  const [content, setContent] = useState<ReactElement>()
  const [loadingContent, setLoadingContent] = useState(true)
  const screenWidth = window.innerWidth as number

  // check canDelete status
  useEffect(() => {
    let username = localStorage.getItem("curr_user")
    let author = props.post.author

    if (username === null) {return}

    if (username === author) {
      setCanDelete(true)
    }

    if (username.includes("admin")) {
      setCanDelete(true)
    }

  }, [props.post.author])

  // get total comments for post preview i.e (4 comments)
  useEffect(() => {
    if (props.comments !== "disabled") {
      getTotalComments(props.post.id).then(count => {
        setCommentCount(count)
        setLoadingContent(false)
      })
    }
  }, [props.comments, props.post.id])

  // check content type, if file, get it and set loading false
  useEffect(() => {
    async function getYTAspectRatio(videoID: string) {
      let height: number = 0
      let width: number = 0
      let maxWidth = 0
  
      if (screenWidth < 1024) {
        maxWidth = (props.comments === "disabled" ? screenWidth * 0.7 : screenWidth * 0.7)
      } else {
        maxWidth = (props.comments === "disabled" ? screenWidth * 0.3 : screenWidth * 0.45)
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

    if (props.post.type === "Text") {
      setContent(<p>{props.post.content}</p>)
      setLoadingContent(false)
    } 
    
    if (props.post.type === "Image") {
      getFileUrl(props.post.content).then(url => {
        setContent(<img className="p-2 mx-auto" src={url} alt="user uploaded" />)
        setLoadingContent(false)
      })
    }

    if (props.post.type === "Video") {
      getFileUrl(props.post.content).then(url => {
        setContent(
        <div className="w-48 mx-auto">
          <video controls height="200" width="200" className="mx-auto" src={url} />
        </div>)
        setLoadingContent(false)
      })
    }

    if (props.post.type === "Link") {
      if(props.post.content.includes("youtu")) {
        let videoID = YouTubeGetID(props.post.content)
        getYTAspectRatio(videoID).then(obj => {
          setContent(<iframe className="mx-auto" width={obj.width} height={obj.height} title="YT video" src={"https://www.youtube.com/embed/" + videoID}></iframe>)
        })
        
      } else {
        setContent(<a className="block hover:text-blue-400" href={props.post.content}>{props.post.content}</a>)
      }
      setLoadingContent(false)
    }
  }, [props.post.content, props.post.type, props.comments, screenWidth])

  const loggedIn = useContext(LoggedInContext)

  const history = useHistory()

  const commentsLink = () => {
    history.push('/' + props.post.subreddit + '/comments/' + props.post.id);
  }

  function compDeletePost() {
    if (window.confirm("Are you sure you would like to delete this post?")) {
      deletePost(props.post.id)
      console.log("post deleted")
      setTimeout(()=>{window.location.reload()}, 1000)
    }
  }

  function YouTubeGetID(url: string){
    let spliturl = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (spliturl[2] !== undefined) ? spliturl[2].split(/[^0-9a-z_-]/i)[0] : spliturl[0];
  }

  return (
    <div className="relative z-0 p-2 lg:p-3 mb-3 border border-gray-200 hover:border-gray-400 bg-white rounded shadow-lg">
      {canDelete ? <div onClick={compDeletePost} className="absolute top-2 right-5 fill-current text-red-600 cursor-pointer"> 
        <FontAwesomeIcon icon={faTrash} /> 
      </div> : ""}

      <p className="hidden">{screenWidth}</p>

      <p className="text-sm">{"Posted by "}
      <Link to={"/users/" + props.post.author}>
        <span className="text-blue-400 hover:underline">{props.post.author}</span>
      </Link>  {"in "}
      <Link to={"/" + props.post.subreddit}>
        <span className="text-blue-400 hover:underline">r/{props.post.subreddit}</span>
      </Link>
      </p>

      <h1 className="text-xl my-1 font-bold">{props.post.title}</h1>
      {loadingContent ? <LoadingIcon /> : content}
      {props.comments === 'disabled' ? "" :
      <Link className="text-sm hover:underline hover:text-blue-500" to={"/" + props.post.subreddit + "/comments/" + props.post.id } >{commentCount} Comments</Link>}
      <Votes type="post" content={props.post} replyFunc={commentsLink} loggedIn={loggedIn} />
    </div>
  )
}

export default Post
