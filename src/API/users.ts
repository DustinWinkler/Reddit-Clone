import {db} from '../firebase'
import type {PostInterface, UserInterface} from './interfaces'

const emptyUser = {
  downvotedIDs: [],
  password: '',
  posts: [],
  upvotedIDs: [],
  username: ''
}

async function getUserInfo(username: string): Promise<UserInterface> {
  let user: UserInterface = emptyUser
  let userRef = db.collection("users").doc(username);

  await userRef.get().then((doc) => {
    if (doc.exists) {
      user = doc.data() as UserInterface
      user["username"] = doc.id
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
})

  return user
}

async function createUser(username: string, password: string): Promise<void> {
  db.collection("users").doc(username).set({
    password: password,
    postkarma: 0,
    posts: [],
    downvotedIDs: [],
    upvotedIDs: []
  })
}

async function userExists(username: string): Promise<boolean> {
  let user: UserInterface = await getUserInfo(username)

  if (user.password) {
    return true
  } else {
    return false
  }
}

async function usernamePasswordExists(username: string, password: string): Promise<boolean> {
  let user = await getUserInfo(username)
  // if user exists
  if (user.password) {
    // if password matches
    if (user.password === password) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

async function updateUser(username: string, user: object): Promise<void> {
  db.collection("users").doc(username).update(user)
}

async function getUserPosts(username: string): Promise<PostInterface[]> {
  let posts: PostInterface[] = []
  await db.collection('posts').where('author', '==', username).get().then(query => {
    query.forEach(doc => {
      let newPost = doc.data() as PostInterface
      newPost['id'] = doc.id
      posts.push(newPost)
    })
  })
  return posts
}

export { getUserInfo, createUser, usernamePasswordExists, userExists, updateUser, getUserPosts }