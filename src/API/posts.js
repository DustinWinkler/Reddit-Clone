import {db, storage} from "../firebase"
import firebase from "firebase/app"
import { hardDelete } from "./comments"

async function getPosts(subreddit) {
  let posts = []
  if (subreddit === 'all' || subreddit === "") {
    await db.collection('posts').get().then(query => {
      query.forEach(doc => {
        let newPost = doc.data()
        newPost['id'] = doc.id
        posts.push(newPost)
      })
    })
  } else {
    await db.collection('posts').where('subreddit', '==', subreddit).get().then(query => {
      query.forEach(doc => {
        let newPost = doc.data()
        newPost['id'] = doc.id
        posts.push(newPost)
      })
    })
  }
  return posts
}

async function getPost(postID) {
  let post = {}
  await db.collection("posts").doc(postID).get().then(doc => {
    post = doc.data()
    post["id"] = doc.id
  })
  return post
}

async function incrementKarma(postID, num) {
  let post = await getPost(postID)
 
  db.collection("posts").doc(postID).update({
    votes: post.votes + num
  })
}

async function decrementKarma(postID, num) {
  let post = await getPost(postID)

  db.collection("posts").doc(postID).update({
    votes: post.votes - num
  })
}

async function addPost(post) {
  let newID
  await db.collection("posts").add(post).then(docRef => {
    newID = docRef.id
  })
  return newID
}

function appendComment(postID, commentID) {
  db.collection("posts").doc(postID).update({
    comments: firebase.firestore.FieldValue.arrayUnion(commentID)
  })
}

async function deletePost(postID) {
  let post = await getPost(postID)

  for (const commentID of post.comments) {
    hardDelete(commentID)
  }

  console.log("deleting post")
  db.collection("posts").doc(postID).delete()

}

async function uploadFile(file) {
  storage.ref().put(file).then(snapshot => {
    console.log("uploaded file")
  })
}

async function getFileUrl(filename) {
  let returnUrl = ''
  await storage.ref().child(filename).getDownloadURL().then(url => {
    returnUrl = url
  })

  return returnUrl
}

async function deleteFile(filename) {
  storage.ref().child(filename).delete()
}

export { getPosts, getPost, incrementKarma, decrementKarma, addPost, appendComment, deletePost, uploadFile, getFileUrl, deleteFile }