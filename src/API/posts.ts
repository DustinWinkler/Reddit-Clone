import {db, storage} from "../firebase"
import firebase from "firebase/app"
import { hardDelete } from "./comments"
import type {PostInterface} from './interfaces'

const emptyPost = {
  author: "",
  comments: [],
  content: '',
  subreddit: '',
  title: '',
  type: 'Text',
  votes: 0,
  id: ''
}

async function getPosts(subreddit: string): Promise<PostInterface[]> {
  let posts: PostInterface[] = []
  if (subreddit === 'all' || subreddit === "") {
    await db.collection('posts').get().then(query => {
      query.forEach(doc => {
        let newPost = doc.data() as PostInterface
        newPost['id'] = doc.id
        posts.push(newPost)
      })
    })
  } else {
    await db.collection('posts').where('subreddit', '==', subreddit).get().then(query => {
      query.forEach(doc => {
        let newPost = doc.data() as PostInterface
        newPost['id'] = doc.id
        posts.push(newPost)
      })
    })
  }
  return posts
}

async function getPost(postID: string): Promise<PostInterface> {
  let post: PostInterface = emptyPost
  await db.collection("posts").doc(postID).get().then(doc => {
    post = doc.data() as PostInterface
    post["id"] = doc.id
  })
  return post
}

async function incrementKarma(postID: string, num: number): Promise<void> {
  let post = await getPost(postID)
 
  db.collection("posts").doc(postID).update({
    votes: post.votes + num
  })
}

async function decrementKarma(postID: string, num: number): Promise<void> {
  let post = await getPost(postID)

  db.collection("posts").doc(postID).update({
    votes: post.votes - num
  })
}

async function addPost(post: object): Promise<string> {
  let newID: string = ''
  await db.collection("posts").add(post).then(docRef => {
    newID = docRef.id
  })
  return newID
}

function appendComment(postID: string, commentID: string) {
  db.collection("posts").doc(postID).update({
    comments: firebase.firestore.FieldValue.arrayUnion(commentID)
  })
}

async function deletePost(postID: string): Promise<void> {
  let post:PostInterface = await getPost(postID)

  for (const commentID of post.comments) {
    hardDelete(commentID)
  }

  console.log("deleting post")
  db.collection("posts").doc(postID).delete()

}

async function uploadFile(file: File): Promise<void> {
  storage.ref().child(file.name).put(file).then(snapshot => {
    console.log("Uploaded file")
  })
}

async function getFileUrl(filename: string): Promise<string> {
  let returnUrl = ''
  await storage.ref().child(filename).getDownloadURL().then(url => {
    returnUrl = url
  })

  return returnUrl
}

async function deleteFile(filename: string): Promise<void> {
  storage.ref().child(filename).delete()
}

export { getPosts, getPost, incrementKarma, decrementKarma, addPost, appendComment, deletePost, uploadFile, getFileUrl, deleteFile }