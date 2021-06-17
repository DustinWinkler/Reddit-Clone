import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect} from 'react'
import { getChildComments, getComment } from '../API/comments'
import { faLongArrowAltDown, faLongArrowAltUp, faReply } from '@fortawesome/free-solid-svg-icons'

function Comment(props) {
  const [hasChildren, setHasChildren] = useState(false)
  const [childComments, setChildComments] = useState([])

  useEffect(() => {
    if (props.comment.comments.length > 0) setHasChildren(true)
  }, [])

  useEffect(() => {
    if (hasChildren) {
      getChildComments(props.comment.id).then(ids => {
        let promises = []
        let commentsToSet = []
        ids.forEach(id => promises.push(getComment(id)))
        Promise.all(promises).then(comments => {
          comments.forEach(comment => commentsToSet.push(comment))
          setChildComments(commentsToSet)
        })
      })
    }
    
  }, [hasChildren])

  return (
    <div className="my-2 p-2 border bg-white">
      <div className="m-1">
        <p className="text-xs text-gray-600 curesor-pointer hover:underline">{props.comment.author}</p>
        <p>{props.comment.content}</p>
        <span className="mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300 fill-curret text-yellow-500"><FontAwesomeIcon icon={faLongArrowAltUp} /></span>
        <span className="mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300 fill-curret text-indigo-600"><FontAwesomeIcon icon={faLongArrowAltDown} /></span>
        <span className="mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300 fill-curret text-blue-400"><FontAwesomeIcon icon={faReply} /></span>
      </div>
      
      <div className="ml-2 border-l-2 pl-2">
        
        {hasChildren ? childComments.map(child => {
          return <Comment comment={child} />
        }) : ""}
      </div>
    </div>
  )
}

export default Comment
