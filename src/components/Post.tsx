import React, { useState, useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Votes from './Votes'
import {LoggedInContext} from '../App'
import { getTotalComments } from '../API/comments'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { deletePost, getFileUrl } from '../API/posts'
import LoadingIcon from './LoadingIcon'

function Post(props) {
  const [commentCount, setCommentCount] = useState(0)
  const [canDelete, setCanDelete] = useState(false)
  const [content, setContent] = useState('')
  const [loadingContent, setLoadingContent] = useState(true)
  const screenWidth = window.innerWidth

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

  }, [])

  // get total comments for post preview i.e (4 comments)
  useEffect(() => {
    if (props.comments !== 'disabled') {
      getTotalComments(props.post.id).then(count => {
        setCommentCount(count)
        setLoadingContent(false)
      })
    }
  }, [])

  // check content type, if file, get it and set loading false
  useEffect(() => {
    if (props.post.type === "Text") {
      setContent(<p>{props.post.content}</p>)
      setLoadingContent(false)
    } 
    
    if (props.post.type === "Image") {
      getFileUrl(props.post.fileUrl).then(url => {
        setContent(<img className="p-2 mx-auto" src={url} alt="user uploaded" />)
        setLoadingContent(false)
      })
    }

    if (props.post.type === "Video") {
      getFileUrl(props.post.fileUrl).then(url => {
        setContent(
        <div className="w-48 mx-auto">
          <video controls height="200" width="200" className="mx-auto" src={url} alt="user uploaded" />
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
  }, [])

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

  function YouTubeGetID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  async function getYTAspectRatio(videoID) {
    let height
    let width
    let maxWidth = 0

    if (screenWidth < 1024) {
      maxWidth = (props.comments === "disabled" ? parseInt(screenWidth * 0.7) : parseInt(screenWidth * 0.7))
    } else {
      maxWidth = (props.comments === "disabled" ? parseInt(screenWidth * 0.3) : parseInt(screenWidth * 0.45))
    }

    await fetch("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=" + videoID)
      .then(resp => resp.json())
      .then(data => {
        height = data.height
        width = data.width
      })
     

    if (parseFloat(21/9).toFixed(4) === parseFloat(width/height).toFixed(4)) {
      // 21:9 ratio 
      return {
        height: maxWidth * (9/21), 
        width: maxWidth
      }
    }
    else if (parseFloat(4/3).toFixed(4) === parseFloat(width/height).toFixed(4)) {
      // 4:3 ratio
      return {
        height: parseInt(maxWidth * (3/4)),
        width: maxWidth
      }
    }

    else {
      // 16:9 ratio for all else
      return {
        height: parseInt(maxWidth * (9/16)),
        width: maxWidth
      }
    }
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
