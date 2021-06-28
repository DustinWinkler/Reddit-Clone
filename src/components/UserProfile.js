import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {getUserPosts, userExists} from "../API/users"
// receive user id and show all their posts

function UserProfile() {
  const [posts, setPosts] = useState([])
  const [doesUserExist, setDoesUserExists] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsEmpty, setPostsEmpty] = useState(true)

  const username = useParams().username

  // ATTEMPT TO ADD COMMENTS

  // check if user exists
  useEffect(() => {
    userExists(username).then(bool => {
      if (bool) {setDoesUserExists(true)}
    })
  }, [])

  // if user exists, get their posts
  useEffect(() => {
    getUserPosts(username).then(posts => {
      if (posts.length) {

      }
    })
  }, [doesUserExist])

  return (
    <div>
      this is the userProfile component
    </div>
  )
}

export default UserProfile 
