import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import {getPosts} from '../API/posts'
import Post from './Post'
import { getSubredditInfo } from '../API/subreddits'

function Subreddit() {
  const [subreddit, setSubreddit] = useState(useParams().subreddit)
  const [subInfo, setSubInfo] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    getPosts(subreddit).then(posts => {
      console.log("subreddit getPosts -> ", posts)
      setPosts(posts)
      setLoadingPosts(false)
    })

    getSubredditInfo(subreddit).then(info => {
      setSubInfo(info.toString())
    })
  }, [])

  function toggleForm() {
    setShowForm(!showForm)
  }

  let newPostForm = (
    <div className={(showForm ? "opacity-100 " : "opacity-0 ") + "transition-opacity duration-500 w-96 -ml-48 inset-x-1/2 text-center absolute"}>
      <form className="flex flex-col flex-wrap">
        <label className="">
          <input className="border my-1 w-full rounded-lg p-2" placeholder="Title" />
        </label>
        <label className="">
          <textarea className="border my-1 w-full rounded-lg p-2" placeholder="Content" rows="5" />
        </label>
        <input className="w-3/5 mx-auto p-1 border-2 border-blue-500 rounded-xl" type="submit" value="Submit" />
      </form>
    </div>
  )

  return (
    <div>
      <header className="text-3xl font-bold mx-auto w-1/5 text-center m-2 bg-white rounded-full p-1 bg-opacity-70">
        r/{subreddit}
      </header>

      <div className="p-1 w-3/5 mx-auto text-center">
        <p className="p-1 bg-white w-full mx-auto">{subInfo}</p>
      </div>

      <div className="w-36 flex justify-around items-center rounded my-2 mx-auto border-2 border-gray-400 p-0.5 bg-white cursor-pointer
      hover:border-gray-700 hover:bg-blue-500 hover:text-white transition duration-100 ease-linear"
      onClick={toggleForm}>

        <span className="text-lg rounded-lg p-0.5">Make a Post </span> 

        <span className={(showForm ? "rotate-45 text-red-500 " : "text-black ") + "transform transition align-middle mx-1 mt-0.5 text-xs fill-current"}>
          <FontAwesomeIcon icon={faPlus} />
        </span>
      </div>

      {newPostForm}

    <div className={(showForm ? "mt-64 " : "") + "transition-all duration-500 w-3/5 mx-auto"}>
      {loadingPosts ? "Loading Posts" : 
      posts.map(post => {
        return <Post post={post} comments="disabled" />
      })}
    </div>

    </div>
  )
}

export default Subreddit
