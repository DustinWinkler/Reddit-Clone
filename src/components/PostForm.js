import React, {useState, useEffect, useContext} from 'react'
import ToggleFormButton from './ToggleFormButton'
import { LoggedInContext } from '../App'
import {addPost} from "../API/posts"

// change fields based on type props
// need text type
// need image and video link types
// upload image/video types???

function PostForm(props) {
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState("Text")
  const [formInput, setFormInput] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')

  const loggedIn = useContext(LoggedInContext)

  useEffect(() => {
    if (formType === 'Text') {setFormInput(textInput)}
    else if (formType === 'Video' || formType === 'Image') {setFormInput(uploadInput)}
    else if (formType === 'Link') {setFormInput(linkInput)}
  }, [formType])

  const uploadInput = (
    <label>
      upload Input
      <input type="file" />
    </label>
  )

  const linkInput = (
    <label>
      link input
      <input type="text" placeholder="Video or Image Link" className="border my-1 w-full rounded-lg p-2" />
    </label>
  )

  const textInput = (
    <label className="">
      text input
      <textarea className="border my-1 w-full rounded-lg p-2" value={formContent} onChange={handleContentChange} placeholder="Content" rows="5" />
    </label>
  )

  function switchType(type) {
    setFormType(type)
  }

  function handleTitleChange(e) {
    setFormTitle(e.target.value)
  }

  function handleContentChange(e) {
    setFormContent(e.target.value)
  }

  function toggleForm() {
    setShowForm(!showForm)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!loggedIn) {
      alert("You must be logged in to comment.")
      return
    }

    let post = {
      author: localStorage.getItem("curr_user"),
      comments: [],
      content: formContent,
      subreddit: props.subreddit,
      title: formTitle,
      votes: 0
    }

    addPost(post).then(id => {
      post["id"] = id
      props.addPostToStateFunc(post)
      setShowForm(false)
    })   
  }

  const buttonStyles="border border-blue-400 py-1 px-3 bg-white rounded-lg w-full mx-1 hover:bg-blue-400 hover:border-gray-500 hover:text-white"

  return (
    <div className="my-6">
      <ToggleFormButton text="Create a Post" toggleForm={toggleForm} showForm={showForm} />

      <div className={(showForm ? "h-auto max-h-96 " : "max-h-0 ") + "overflow-hidden transition-all duration-500 w-96 mx-auto text-center"}>
        
      <p>{formType}</p>

      <div className="flex w-full justify-around mb-2">
        <button className={buttonStyles} onClick={()=>{switchType("Text")}}>Text</button>
        <button className={buttonStyles} onClick={()=>{switchType("Image")}}>Image</button>
        <button className={buttonStyles} onClick={()=>{switchType("Video")}}>Video</button>
        <button className={buttonStyles} onClick={()=>{switchType("Link")}}>Link</button>
      </div>

        <form className="flex flex-col flex-wrap">
          <label className="">
            <input className="border my-1 w-full rounded-lg p-2" value={formTitle} onChange={handleTitleChange} placeholder="Title" />
          </label>
          
          {formInput}

          <button className="w-3/5 mx-auto p-1 border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer text-center bg-gray-200" onClick={handleSubmit} >Submit</button>
        </form>
      </div>
    </div>
  )
}

export default PostForm
