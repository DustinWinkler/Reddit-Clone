import React, { useState, useEffect, useContext } from 'react'
import { getChildComments, getComment } from '../API/comments'
import {LoggedInContext} from "../App"
import Votes from './Votes'

function Comment(props) {
  const [hasChildren, setHasChildren] = useState(false)
  const [childComments, setChildComments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formContent, setFormContent] = useState('')

  const loggedIn = useContext(LoggedInContext)
  

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

  const commentForm = (
    <div className={(showForm ? "h-max max-h-32 " : "max-h-0 ") + "ml-2 overflow-hidden transition-all duration-500"}>
      <form onSubmit={handleSubmit}>
        <label>
          <textarea className="block py-1 px-2 border border-gray-300 rounded-lg w-4/5" value={formContent} placeholder="Comment." rows="3" onChange={handleChange} />
        </label>
        <input className="w-max my-1 py-0 px-3 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" type="submit" value="Reply" />
      </form>
    </div>
  )

  function handleChange(e) {
    setFormContent(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // add new Comment object to children
    
    // send identical object to DB
  }

  function toggleForm() {
    setShowForm(!showForm)
  }

  return (
    <div className="my-2 p-2 border bg-white">
      <div>
        <p className="text-xs text-gray-600 cursor-pointer active:text-black hover:underline">{props.comment.author}</p>
        <p>{props.comment.content}</p>
        <Votes type="comment" loggedIn={loggedIn} replyFunc={toggleForm} content={props.comment} /> 
        {commentForm}
      </div>
      
      <div className="ml-2 border-l-2 pl-2">
        
        {hasChildren ? childComments.map(child => {
          return <Comment loggedIn={loggedIn} key={child.id} comment={child} />
        }) : ""}
      </div>
    </div>
  )
}

export default Comment
