import React, { useState, useEffect } from 'react'
import { getUserInfo, updateUser } from '../API/users'
import { incrementKarma as commentUp, decrementKarma as commentDown } from "../API/comments"
import { incrementKarma as postUp, decrementKarma as postDown } from "../API/posts"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltDown, faLongArrowAltUp, faReply } from '@fortawesome/free-solid-svg-icons'

function Votes(props) {
  const [netVotes, setNetVotes] = useState(props.content.votes)
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")))
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [hasDownvoted, setHasDownvoted] = useState(false)
  const [votingDisabled, setVotingDisabled] = useState(false)

// check vote status
  useEffect(() => {
    // if comment id is in up or down voted arrays, set vote status
    if (userInfo && userInfo.upvotedIDs.includes(props.content.id)) {
      setHasUpvoted(true)
    } else if (userInfo && userInfo.downvotedIDs.includes(props.content.id)) {
      setHasDownvoted(true)
    }
  }, [])


  let karmaUp
  let karmaDown

  if (props.type === 'post') {
    karmaUp = postUp
    karmaDown = postDown
  } else if (props.type === 'comment') {
    karmaUp = commentUp
    karmaDown = commentDown
  }

  function getUpdatedUser() {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")))
    console.log("votes comp, user -> ", userInfo)
  }

  function setUpdatedUser(user) {
    localStorage.setItem("userInfo", JSON.stringify(user))
  }

  function upvote() {
    if (votingDisabled) {
      alert("Slow down there Bucko! My DB cannot handle calls this quickly.")
      return
    }

    let incrementCount = 1
    getUpdatedUser()

    // if downvoted, remove it
    if (hasDownvoted) {
      setHasDownvoted(false)
      incrementCount += 1
    }

    if (loggedIn) {
      let user = userInfo
      let username = user.username

      if (hasUpvoted) {
        let index = user.upvotedIDs.indexOf(props.content.id)
        user.upvotedIDs.splice(index, 1)
        setUserInfo(user)
        console.log("just before update -> user: ", user, "username: ", username)
        updateUser(username, user)
        setHasUpvoted(false)
        setNetVotes(prev => prev - 1)
        karmaDown(props.content.id, 1)
      } else {
        user.upvotedIDs.push(props.content.id)
        setUserInfo(user)
        updateUser(username, user)
        setHasUpvoted(true)
        setNetVotes(prev => prev + incrementCount)
        karmaUp(props.content.id, incrementCount)
      }

      setUpdatedUser(user)
    } else {
      alert("You must be logged in to vote on stuff!")
    }

    setVotingDisabled(true)
    setTimeout(()=>{setVotingDisabled(false)}, 1000)
  }

  function downvote() {
    if (votingDisabled) {
      alert("Slow down there Bucko! My DB cannot handle calls this quickly.")
      return
    }

    let decrementCount = 1
    getUpdatedUser()
    // if upvoted remove that upvote
    if(hasUpvoted) {
      setHasUpvoted(false)
      decrementCount += 1
    }

    if (loggedIn) {
      let user = userInfo
      let username = user.username
      if (hasDownvoted) {
        let index = user.downvotedIDs.indexOf(props.content.id)
        user.downvotedIDs.splice(index, 1)
        setUserInfo(user)
        updateUser(username, user)
        setHasDownvoted(false)
        setNetVotes(prev => prev + 1)
        karmaUp(props.content.id, 1)
      } else {
        user.downvotedIDs.push(props.content.id)
        setUserInfo(user)
        updateUser(username, user)
        setHasDownvoted(true)
        setNetVotes(prev => prev - decrementCount)
        karmaDown(props.content.id, decrementCount)
      }

      setUpdatedUser(user)
    } else {
      alert("You must be logged in to vote on stuff!")
    }

    setVotingDisabled(true)
    setTimeout(()=>{setVotingDisabled(false)}, 2000)
  }

  return (
    <div className="m-1">
      <span onClick={upvote} className={ (hasUpvoted ? "fill-curret text-yellow-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltUp} /></span>
      <span>{netVotes}</span>
      <span onClick={downvote} className={ (hasDownvoted ? "fill-curret text-indigo-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltDown} /></span>
      <span onClick={props.replyFunc} className="mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300 fill-curret text-blue-400"><FontAwesomeIcon icon={faReply} /></span>
    </div>
  )
}

export default Votes
