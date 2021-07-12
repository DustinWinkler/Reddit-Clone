import React, {useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import{ addSubreddit, getAllSubreddits, subExists } from "../API/subreddits"
import LoadingIcon from './LoadingIcon'
import ToggleFormButton from './ToggleFormButton'
import {LoggedInContext} from "../App"

function Subreddits() {
  const [subList, setSubList] = useState([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  
  const loggedIn = useContext(LoggedInContext)

  useEffect(() => {
    getAllSubreddits().then(list => {
      setSubList(list)
      setLoadingSubs(false)
    })
  }, [])

  function toggleForm() {
    setShowForm(!showForm)
  }

  function handleTitleChange(e) {
    setFormTitle(e.target.value)
  }

  function handleDescriptionChange(e) {
    setFormDescription(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()

    subExists(formTitle).then(bool => {
      if (!loggedIn) {
        alert("You must be logged in to create a subreddit.")
        return
      }

      if (bool) {
        alert("That subreddit already exists")
        setShowForm(false)
        return
      }

      addSubreddit(formTitle, formDescription)

      let newSub = {
        description: formDescription,
        id: formTitle
      }
  
      let oldSubs = subList
      oldSubs.push(newSub)
      setSubList(oldSubs)
  
      setShowForm(false)
      setFormTitle('')
      setFormDescription('')
    })
  }

  const subredditForm = (
    <div className={(showForm ? "opacity-100 visible " : "opacity-0 invisible ") + "transition-opacity duration-500 w-96 -ml-48 inset-x-1/2 text-center absolute"}>
      <form className="flex flex-col flex-wrap" onSubmit={handleSubmit}>
        <label className="">
          <input className="border my-1 w-full rounded-lg p-2" onChange={handleTitleChange} value={formTitle} placeholder="Title" />
        </label>
        <label className="">
          <textarea className="border my-1 w-full rounded-lg p-2" onChange={handleDescriptionChange} value={formDescription} placeholder="Description" rows="5" />
        </label>
        <input className="w-3/5 mx-auto p-1 border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" type="submit" value="Submit" />
      </form>
    </div>
  )

  return (
    <div>

      <ToggleFormButton text="Create a Subreddit" toggleForm={toggleForm} showForm={showForm} />

      {subredditForm}

      <div className={(showForm ? "mt-64 " : "") + "transition-all duration-500 w-full md:w-3/5 p-2 mx-auto"}>
      { loadingSubs ? <LoadingIcon /> :
      subList.map(sub => {
        return (
        <div>
          <Link to={'/' + sub.id}>
            <div className="my-4 p-2 bg-white shadow-lg rounded border border-gray-400 hover:bg-gray-200">
              <header className="text-center text-2xl m-1 font-bold">r/{sub.id}</header>
              <p>{sub.description}</p>
            </div>
          </Link>
        </div>
        )
        // getSubInfo(sub) -> then put other info in here
      })}
      </div>

    </div>
  )
}

export default Subreddits
