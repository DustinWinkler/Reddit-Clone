import React, { useState, useEffect, useContext, FC, ReactElement} from 'react'
import {LoggedInContext} from "../App"
import Votes from './Votes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { COMMENT, CURRENT_USER_DETAILS } from '../GraphQL/queries'
import { CREATE_COMMENT, DELETE_COMMENT } from '../GraphQL/mutations'
import LoadingIcon from './LoadingIcon'

type CommentProps = {
  commentID: string
}

const Comment: FC<CommentProps> = ({ commentID }) => {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [formContent, setFormContent] = useState<string>('')
  const [canDelete, setCanDelete] = useState<boolean>(false)
  const [commentContent, setCommentContent] = useState<string | ReactElement>('')

  const loggedIn = useContext(LoggedInContext)

  const { data: userData, loading: userLoading } = useQuery(CURRENT_USER_DETAILS, {
    fetchPolicy: "network-only"
  })

  const { loading, error, data } = useQuery(COMMENT, {
    variables: {
      ID: commentID
    }
  })

  const [deleteComment, { error: deleteError }] = useMutation(DELETE_COMMENT, {
    variables: {
      ID: commentID
    },
    refetchQueries: [
      "getPost",
      "getComment"
    ]
  })

  const [createComment, { error: createError }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      "getPost",
      "getComment"
    ]
    // optimistic response?
  })

  //DELETE LATER, JUST GETTING RID OF ERRORS
  if (deleteError || createError) console.log('meme');

  // check if user is admin or original author
  useEffect(() => {
    let user = userData?.currentUserDetails?.id
    let author = data?.comment.author.id
    if (user === undefined || author === undefined) return
    if (user === author) {
      setCanDelete(true)
    }
  }, [userData, data, loading, userLoading])

  useEffect(() => {
    if (data?.comment) setCommentContent(
      data?.comment?.content.split("\n").join(" ").split(" ").map((s: string) => {
        return urlify(s)
      })
    )
  }, [data])

  const commentForm = (
    <div className={(showForm ? "h-max max-h-32 " : "max-h-0 ") + "ml-2 overflow-hidden transition-all duration-500"}>
      <form onSubmit={(e: React.FormEvent) => {handleSubmit(e)}}>
        <label>
          <textarea className="block py-1 px-2 border border-gray-300 rounded-lg w-4/5" value={formContent} placeholder="Comment." rows={3} onChange={(e: React.FormEvent) => {handleChange(e)}} />
        </label>
        <input className="w-max my-1 py-0 px-3 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" type="submit" value="Reply" />
      </form>
    </div>
  )

  function handleChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    if (target) setFormContent(target.value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!loggedIn) {
      alert("You must be logged in to comment.")
      return
    }

    let comment = {
      content: formContent,
    }
    console.log('creating comment');
    
    createComment({
      variables: {
        commentInfo: comment,
        parentID: commentID,
        parentType: "comment"
      }
    })
    
    setShowForm(false)
  }

  function toggleForm() {
    setShowForm(!showForm)
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      console.log('deleting');
      deleteComment()
    }
  }
  
  function urlify(text: string): ReactElement {
    let urlRegex = /(https?:\/\/[^\s]+)/g
    if (urlRegex.test(text)) {
      return (<a className="text-blue-500 hover:text-blue-700" target="_blank" rel="noreferrer" href={text}>{text}</a>)
    } else {
      return (<span>{text + " "}</span>)
    }
  }

  

  if (loading) return (<LoadingIcon/>)
  if (error) return (<p>There was an error loading these comments</p>)

  return (
    <div className="relative my-2 p-2 border rounded-lg bg-white hover:border-gray-600">
      {canDelete ? <div onClick={handleDelete} className="absolute top-2 right-5 fill-current text-red-600 cursor-pointer"> 
        <FontAwesomeIcon icon={faTrash} /> 
      </div> : ""}
      <div>
        <Link to={"/users/" + data.comment.author.id}><p className="text-xs text-gray-600 cursor-pointer active:text-black hover:underline">{data.comment.author.username}</p></Link>
        <p>{commentContent}</p>
        <Votes replyFunc={toggleForm} content={data.comment} />
        {commentForm}
      </div>
      
      <div className="ml-2 border-l-2 pl-2">
        
        {data?.comment.comments.length > 0 ? data?.comment.comments.map((id: string) => {          
          return <Comment key={id} commentID={id} />
        }) : ""}
      </div>
    </div>
  )
}

export default Comment
