import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { useParams } from "react-router-dom"
import {getPosts} from '../API/posts'

function Subreddit() {
  const [subreddit, setSubreddit] = useState(useParams().subreddit)
  const [showForm, setShowForm] = useState(false)

  function toggleForm() {
    setShowForm(!showForm)
  }

  let newPostForm = (
    <div className={(showForm ? "opacity-100 " : "opacity-0 ") + "transition-opacity duration-500 w-48 mx-auto text-center fixed"}>
      <form>
        weiner
      </form>
    </div>
  )

  return (
    <div>
      <div className="w-28 flex justify-around items-center rounded my-2 mx-auto border-2 border-gray-400 p-1 bg-white cursor-pointer
      hover:border-gray-700 hover:bg-gray-700 hover:text-white transition duration-100 ease-linear delay-300"
      onClick={toggleForm}>

        <span className="text-lg">New Post </span> 

        <span className="align-middle mx-1 text-xs">
          <FontAwesomeIcon icon={faPlus} />
        </span>
      </div>

      {newPostForm}

    <div className={(showForm ? "mt-20 " : "") + "transition-all duration-500"}>
      <p>This is the {subreddit} component</p>
      <p>put some posts down here</p>
    </div>

    </div>
  )
}

export default Subreddit
