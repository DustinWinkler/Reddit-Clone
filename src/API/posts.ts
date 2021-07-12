import {db, storage} from "../firebase"
import firebase from "firebase/app"
import { hardDelete } from "./comments"
import type {Post} from './interfaces'

const emptyPost = {
  author: "",
  comments: [],
  content: '',
  subreddit: '',
  title: '',
  type: 'Text',
  votes: 0
}

async function getPosts(subreddit: string) {
  let posts: object[]
  if (subreddit === 'all' || subreddit === "") {
    await db.collection('posts').get().then(query => {
      query.forEach(doc => {
        let newPost = doc.data()
        newPost['id'] = doc.id
        posts.push(newPost)
      })
    }).then(()=>{return posts})
  } else {
    await db.collection('posts').where('subreddit', '==', subreddit).get().then(query => {
      query.forEach(doc => {
        let newPost = doc.data()
        newPost['id'] = doc.id
        posts.push(newPost)
      })
    }).then(()=>{return posts})
  }
}

async function getPost(postID: string): Promise<Post> {
  let post: Post = emptyPost
  await db.collection("posts").doc(postID).get().then(doc => {
    post = doc.data()
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

async function addPost(post: object) {
  let newID
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

async function deletePost(postID: string) {
  let post:Post = await getPost(postID)

  for (const commentID of post.comments) {
    hardDelete(commentID)
  }

  console.log("deleting post")
  db.collection("posts").doc(postID).delete()

}

async function uploadFile(file: File) {
  storage.ref().child(file.name).put(file).then(snapshot => {
    console.log("uploaded file")
  })
}

async function getFileUrl(filename: string) {
  let returnUrl = ''
  await storage.ref().child(filename).getDownloadURL().then(url => {
    returnUrl = url
  })

  return returnUrl
}

async function deleteFile(filename: string) {
  storage.ref().child(filename).delete()
}

export { getPosts, getPost, incrementKarma, decrementKarma, addPost, appendComment, deletePost, uploadFile, getFileUrl, deleteFile }