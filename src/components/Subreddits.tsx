import React, {useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import LoadingIcon from './LoadingIcon'
import ToggleFormButton from './ToggleFormButton'
import {LoggedInContext} from "../App"
import { useMutation, useQuery } from '@apollo/client'
import { SUBREDDITS } from '../GraphQL/queries'
import { CREATE_SUBREDDIT } from '../GraphQL/mutations'

interface Subreddit {
  title: string,
  description: string,
  id: string
}

interface SubredditData {
  subreddits: Subreddit[]
}

function Subreddits() {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const loggedIn = useContext(LoggedInContext)

  const [addSubreddit, {error: subredditError}] = useMutation(CREATE_SUBREDDIT, {
    variables: {
      subredditInfo: {
        title,
        description
      }
    },
    onCompleted: () => {
      setShowForm(false)
    },
    refetchQueries: [
      "getSubreddits"
    ]
  })

  const { loading, error, data } = useQuery<SubredditData>(SUBREDDITS)
  if (error) return (<div>Error: {error.message}</div>)

  

  function toggleForm() {
    setShowForm(!showForm)
  }

  function handleTitleChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setTitle(target.value)
  }

  function handleDescriptionChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setDescription(target.value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!loggedIn) {
      alert("You must be logged in to create a subreddit.")
      return
    }
    addSubreddit()
  }

  const subredditForm = (
    <div className={(showForm ? "opacity-100 visible " : "opacity-0 invisible ") + "transition-opacity duration-500 w-96 -ml-48 inset-x-1/2 text-center absolute"}>
      <form className="flex flex-col flex-wrap" onSubmit={handleSubmit}>
        <label className="">
          <input className="border my-1 w-full rounded-lg p-2" onChange={handleTitleChange} value={title} placeholder="Title" />
        </label>
        <label className="">
          <textarea className="border my-1 w-full rounded-lg p-2" onChange={handleDescriptionChange} value={description} placeholder="Description" rows={5} />
        </label>
        <input className="w-3/5 mx-auto p-1 border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" type="submit" value="Submit" />
      </form>
    </div>
  )

  return (
    <div>

      <ToggleFormButton text="Create a Subreddit" toggleForm={toggleForm} showForm={showForm} />

      {subredditForm}

      {subredditError && <p>Error: {subredditError.message}</p> }

      <div className={(showForm ? "mt-64 " : "") + "transition-all duration-500 w-full md:w-3/5 p-2 mx-auto"}>
      { loading ? <LoadingIcon /> :
      data?.subreddits.map((sub, i) => {
        return (
        <div key={i}>
          <Link to={'/' + sub.id}>
            <div className="my-4 p-2 bg-white shadow-lg rounded border border-gray-400 hover:bg-gray-200">
              <header className="text-center text-2xl m-1 font-bold">r/{sub.title}</header>
              <p>{sub.description}</p>
            </div>
          </Link>
        </div>
        )
      })}
      </div>

    </div>
  )
}

export default Subreddits
