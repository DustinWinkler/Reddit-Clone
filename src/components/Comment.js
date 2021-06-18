import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect} from 'react'
import { getChildComments, getComment, incrementKarma, decrementKarma } from '../API/comments'
import { faLongArrowAltDown, faLongArrowAltUp, faReply } from '@fortawesome/free-solid-svg-icons'
import { getUserInfo, updateUser } from '../API/users'

function Comment(props) {
  const [hasChildren, setHasChildren] = useState(false)
  const [childComments, setChildComments] = useState([])
  const [netVotes, setNetVotes] = useState(props.comment.votes)
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [hasDownvoted, setHasDownvoted] = useState(false)

  // check for children
  useEffect(() => {
    if (props.comment.comments.length > 0) setHasChildren(true)
  }, [])

  // if children, get those comment objects and set them in order to nest them in this component
  useEffect(() => {
    if (hasChildren) {
      getChildComments(props.comment.id).then(ids => {
        let promises = []
        let commentsToSet = []
        ids.forEach(id => promises.push(getComment(id)))
        Promise.all(promises).then(comments => {
          comments.forEach(comment => commentsToSet.push(comment))
          setChildComments(commentsToSet.sort((a, b) => b.votes - a.votes))
        })
      })
    }
    
  }, [hasChildren])

  // check vote status
  useEffect(() => {
    console.log("comment voted on ? -> ", userInfo.upvotedIDs.includes(props.comment.id))
    // if comment id is in up or down voted arrays, set vote status
    if (userInfo.upvotedIDs.includes(props.comment.id)) {
      setHasUpvoted(true)
    } else if (userInfo.downvotedIDs.includes(props.comment.id)) {
      setHasDownvoted(true)
    }

    
  }, [])

  function getUpdatedUser() {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")))
  }

  function setUpdatedUser(user) {
    localStorage.setItem("userInfo", JSON.stringify(user))
  }

  function upvote() {
    getUpdatedUser()

    // if downvoted, remove it
    if (hasDownvoted) {downvote()}

    if (loggedIn) {
      let user = userInfo
      let username = user.username

      if (hasUpvoted) {
        let index = user.upvotedIDs.indexOf(props.comment.id)
        user.upvotedIDs.splice(index, 1)
        setUserInfo(user)
        console.log("just before update -> user: ", user, "username: ", username)
        updateUser(username, user)
        setHasUpvoted(false)
        setNetVotes(prev => prev - 1)
        decrementKarma(props.comment.id)
      } else {
        user.upvotedIDs.push(props.comment.id)
        setUserInfo(user)
        updateUser(username, user)
        setHasUpvoted(true)
        setNetVotes(prev => prev + 1)
        incrementKarma(props.comment.id)
      }

      setUpdatedUser(user)
    } else {
      alert("You must be logged in to vote on stuff!")
    }
  }

  function downvote() {
    getUpdatedUser()

    // if upvoted remove that upvote
    if(hasUpvoted) {upvote()}

    if (loggedIn) {
      let user = userInfo
      let username = user.username
      if (hasDownvoted) {
        let index = user.downvotedIDs.indexOf(props.comment.id)
        user.downvotedIDs.splice(index, 1)
        setUserInfo(user)
        updateUser(username, user)
        setHasDownvoted(false)
        setNetVotes(prev => prev + 1)
        incrementKarma(props.comment.id)
      } else {
        user.downvotedIDs.push(props.comment.id)
        setUserInfo(user)
        updateUser(username, user)
        setHasDownvoted(true)
        setNetVotes(prev => prev - 1)
        decrementKarma(props.comment.id)
      }

      setUpdatedUser(user)
    } else {
      alert("You must be logged in to vote on stuff!")
    }
  }

  return (
    <div className="my-2 p-2 border bg-white">
      <div className="m-1">
        <p className="text-xs text-gray-600 curesor-pointer hover:underline">{props.comment.author}</p>
        <p>{props.comment.content}</p>
        <span onClick={upvote} className={ (hasUpvoted ? "fill-curret text-yellow-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltUp} /></span>
        <span>{netVotes}</span>
        <span onClick={downvote} className={ (hasDownvoted ? "fill-curret text-indigo-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltDown} /></span>
        <span className="mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300 fill-curret text-blue-400"><FontAwesomeIcon icon={faReply} /></span>
      </div>
      
      <div className="ml-2 border-l-2 pl-2">
        
        {hasChildren ? childComments.map(child => {
          return <Comment loggedIn={loggedIn} comment={child} />
        }) : ""}
      </div>
    </div>
  )
}

export default Comment
