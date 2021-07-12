import React, {useState, useEffect, useContext, useMemo, ReactElement} from 'react'
import ToggleFormButton from './ToggleFormButton'
import { LoggedInContext } from '../App'
import {addPost, uploadFile} from "../API/posts"
import { PostInterface } from '../API/interfaces'

type PostFormProps = {
  subreddit: string
  addPostToStateFunc: Function
}

function PostForm(props: PostFormProps) {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [formType, setFormType] = useState<string>("Text")
  const [formInput, setFormInput] = useState<ReactElement>()
  const [formTitle, setFormTitle] = useState<string>('')
  const [formContent, setFormContent] = useState<string>('')
  const [formFile, setFormFile] = useState<File>()

  const loggedIn = useContext(LoggedInContext)

  const textInput = useMemo<ReactElement>(() => {
    return (<label className="">
      <textarea className="border my-1 w-full rounded-lg p-2" value={formContent} onChange={handleContentChange} placeholder="Content" rows={5} />
    </label>)
  }, [formContent])

  const uploadInput = useMemo<ReactElement>(() => {
    return (<label className="my-2">
      <input type="file" onChange={handleFileChange} />
    </label>)

  function handleFileChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    let file: File

    if (target.files) {
      file = target.files[0]
    } else {
      return
    }

    if (file.size > 10000000) {
      alert("File size cannot exceed 10 MB")
      return
    }

    // i.e ".jpeg" or ".mp4"
    let extension = "." + file.type.split("/")[1]

    // appends random number to make file name unique to prevent uploading of files with same name
    let newName = file.name.split(".")[0] + randomNumber() + extension

    Object.defineProperty(file, 'name', {
      writable: true,
      value: newName
    })

    setFormFile(file)

    console.log("updated file -> ", file)
  }
  }, [])

  const linkInput = useMemo<ReactElement>(() => {
    return (<label className="my-2">
      <p>Youtube Links will be embedded nicely :)</p>
      <input type="text" placeholder="Video, Image, News, etc." value={formContent} onChange={handleContentChange} className="border my-1 w-full rounded-lg p-2" />
    </label>)
  }, [formContent])

  useEffect(() => {
    if (formType === 'Text') {setFormInput(textInput)}
    else if (formType === 'Video' || formType === 'Image') {setFormInput(uploadInput)}
    else if (formType === 'Link') {setFormInput(linkInput)}
  }, [formType, linkInput, textInput, uploadInput])

  function switchType(type: string) {
    setFormType(type)
  }

  function handleTitleChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setFormTitle(target.value)
  }

  function handleContentChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setFormContent(target.value)
  }

  // return random number for the purpose of uniquely naming files uploaded
  function randomNumber() {
    return Math.floor(100000 + Math.random() * 900000)
  }

  function toggleForm() {
    setShowForm(!showForm)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!loggedIn) {
      alert("You must be logged in to create posts.")
      return
    }

    if (formType === "Image" || formType === "Video") {
      if (formFile === undefined || formTitle === "") {
        alert("Make sure you have uploaded a file and added a title")
        return
      }
    } else {
      if (formContent === "" || formTitle === "") {
        alert("Make sure you have add some content and added a title")
        return
      }
    }

    let post: PostInterface = {
      author: localStorage.getItem("curr_user") as string,
      comments: [],
      content: '',
      subreddit: props.subreddit,
      title: formTitle,
      votes: 0,
      type: formType,
      id: ''
    }

    if (formType === "Image" || formType === "Video") {
      if(formFile) {
        post.content = formFile.name
      }
    } else {
      post.content = formContent
    }

    addPost(post).then(id => {
      post["id"] = id
      props.addPostToStateFunc(post)
      setShowForm(false)

      if ((formType === "Image" || formType === "Video") && formFile) {
        uploadFile(formFile)
        // window.location.reload
      }
    })   
  }

  const buttonStyles="border border-blue-400 py-1 px-3 bg-white rounded-lg w-full mx-1 hover:bg-blue-400 hover:border-gray-500 hover:text-white"

  return (
    <div className="my-1 bg-white py-2 px-4 border rounded-lg w-max max-w-2xl mx-auto">
      <ToggleFormButton text="Create a Post" toggleForm={toggleForm} showForm={showForm} />

      <div className={(showForm ? "h-auto max-h-96 " : "max-h-0 ") + "overflow-hidden transition-all duration-300 ease-in-out w-96 mx-auto text-center"}>
        
      <p className="text-xl font-bold p-1 rounded-lg">{formType}</p>

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
