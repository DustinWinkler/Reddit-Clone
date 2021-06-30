import React, { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import {addPost, getPosts} from '../API/posts'
import Post from './Post'
import { getSubredditInfo } from '../API/subreddits'
import ToggleFormButton from './ToggleFormButton'
import LoadingIcon from './LoadingIcon'
import Posts from './Posts'
import PostForm from './PostForm'

function Subreddit() {
  const [subInfo, setSubInfo] = useState('')
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  const subreddit = useParams().subreddit

  useEffect(() => {
    getPosts(subreddit).then(posts => {
      setPosts(posts)
      setLoadingPosts(false)
    })

    getSubredditInfo(subreddit).then(info => {
      setSubInfo(info.toString())
    })
  }, [])

  function addPostToState(post) {
    let oldPosts = posts
    oldPosts.push(post)
    setPosts(oldPosts)
    setLoadingPosts(true)
    setTimeout(()=>{setLoadingPosts(false)}, 100)
  }

  return (
    <div>
      <header className="text-3xl font-bold mx-auto w-max text-center m-2 bg-white rounded-lg px-12 py-1 bg-opacity-70 border border-gray-400">
        r/{subreddit}
      </header>

      <div className="p-1 w-screen md:w-3/5 mx-auto text-center">
        <p className="py-1 px-4 bg-white mx-auto border border-gray-400 rounded ">{subInfo}</p>
      </div>


      <PostForm subreddit={subreddit} addPostToStateFunc={addPostToState} />

    <div className="transition-all duration-500 mx-auto w-full md:w-3/5 p-2">
      {loadingPosts ? <LoadingIcon/> : posts.map(post => {return <Post key={post.id} post={post} />})}
    </div>

    </div>
  )
}

export default Subreddit
