import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import {getPosts} from '../API/posts'
import Post from './Post'
import { getSubredditInfo } from '../API/subreddits'
import ToggleFormButton from './ToggleFormButton'
import LoadingIcon from './LoadingIcon'

function Subreddit() {
  const [subreddit, setSubreddit] = useState(useParams().subreddit)
  const [subInfo, setSubInfo] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    getPosts(subreddit).then(posts => {
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

  function addPostToState(post) {

  }

  function handleSubmit(e) {

  }

  let newPostForm = (
    <div className={(showForm ? "opacity-100 visible " : "opacity-0 invisible ") + "transition-opacity duration-500 w-96 -ml-48 inset-x-1/2 text-center absolute"}>
      <form className="flex flex-col flex-wrap" onSumbit={handleSubmit}>
        <label className="">
          <input className="border my-1 w-full rounded-lg p-2" placeholder="Title" />
        </label>
        <label className="">
          <textarea className="border my-1 w-full rounded-lg p-2" placeholder="Content" rows="5" />
        </label>
        <input className="w-3/5 mx-auto p-1 border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white hover:border-gray-600 cursor-pointer" type="submit" value="Submit" />
      </form>
    </div>
  )

  return (
    <div>
      <header className="text-3xl font-bold mx-auto w-max text-center m-2 bg-white rounded-lg px-12 py-1 bg-opacity-70 border border-gray-400">
        r/{subreddit}
      </header>

      <div className="p-1 w-3/5 mx-auto text-center">
        <p className="py-1 px-4 bg-white w-max max-w-3xl mx-auto border border-gray-400 rounded ">{subInfo}</p>
      </div>

      <ToggleFormButton text="Create a Post" toggleForm={toggleForm} showForm={showForm} />

      {newPostForm}

    <div className={(showForm ? "mt-64 " : "") + "transition-all duration-500 w-3/5 mx-auto"}>
      {loadingPosts ? <LoadingIcon/> : 
      posts.map(post => {
        return <Post post={post} />
      })}
    </div>

    </div>
  )
}

export default Subreddit
