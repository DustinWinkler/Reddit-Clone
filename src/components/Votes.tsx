import React, { useState, useEffect, FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltDown, faLongArrowAltUp, faReply } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@apollo/client'
import { CURRENT_USER_DETAILS } from '../GraphQL/queries'
import { CommentInterface, PostInterface } from '../TS/interfaces'
import { DOWNVOTE_ITEM, UPVOTE_ITEM } from '../GraphQL/mutations'

type VotesProps = {
  content: PostInterface | CommentInterface
  replyFunc: Function
}

const Votes: FC<VotesProps> = ({ content, replyFunc }) => {
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [hasDownvoted, setHasDownvoted] = useState(false)

  const { data: userData, loading } = useQuery(CURRENT_USER_DETAILS, {
    pollInterval: 2000
  })

  const [ upvote ] = useMutation(UPVOTE_ITEM, {
    variables: {
      ID: content.id
    },
    onCompleted: async ({ upvoteItem }) => {
      localStorage.setItem("userToken", upvoteItem.newToken)
    },
    refetchQueries: [
      "getPostsForHome",
      "getPostsForSubreddit",
      "getPostsForUser",
      "getPost",
      "getComment",
    ],
  })

  const [ downvote ] = useMutation(DOWNVOTE_ITEM, {
    variables: {
      ID: content.id
    },
    onCompleted: ({ downvoteItem }) => {
      localStorage.setItem("userToken", downvoteItem.newToken)
    },
    refetchQueries: [
      "getPostsForHome",
      "getPostsForSubreddit",
      "getPostsForUser",
      "getPost",
      "getComment",
      "currentUserDetails"
    ],
  })

// check vote status
  useEffect(() => {
    console.log('userData has changed');
    
    if (loading || userData.currentUserDetails === null) {
      setHasDownvoted(false)
      setHasUpvoted(false)
      return
    }
    if (userData?.currentUserDetails.upvotedIDs.includes(content.id)) {
      setHasUpvoted(true)
    } else {
      setHasUpvoted(false)
    }
    
    if (userData?.currentUserDetails.downvotedIDs.includes(content.id)) {
      setHasDownvoted(true)
    } else {
      setHasDownvoted(false)
    }
  }, [userData, content.id, loading])

  function handleUpvote() {    
    if (loading) alert("Please wait while we check your login status")
    if (userData.currentUserDetails === null) {
      alert("You must be logged into to vote")
    } else {
      upvote()
    }
  }

  function handleDownvote() {
    if (loading) alert("Please wait while we check your login status")
    if (userData.currentUserDetails === null) {
      alert("You must be logged into to vote")
    } else {
      downvote()
    }
  }

  return (
    <div className="m-1">
      <span onClick={handleUpvote} className={ (hasUpvoted ? "fill-curret text-yellow-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltUp} /></span>
      <span>{content.votes}</span>
      <span onClick={handleDownvote} className={ (hasDownvoted ? "fill-curret text-indigo-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltDown} /></span>
      <span onClick={()=>{replyFunc()}} className="mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300 fill-curret text-blue-400"><FontAwesomeIcon icon={faReply} /></span>
    </div>
  )
}

export default Votes
