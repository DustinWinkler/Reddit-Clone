import { comment } from 'postcss'
import firebase from "firebase/app"
import {db} from '../firebase'
import {appendComment, getPost} from "./posts"

async function getComment(commentID) {
  let comment = {}

  await db.collection("comments").doc(commentID).get().then(doc => {
    comment = doc.data()
    comment['id'] = doc.id
  })
  return comment
}

async function getTopLevelCommentIDs(postID) {
  let ids = []
  let post = await getPost(postID)
  
  post.comments.forEach(comment => {
    ids.push(comment)
  })
  return ids
}

async function getChildComments(commentID) {
  let ids = []
  let comment
  await db.collection("comments").doc(commentID).get().then(doc => {
    comment = doc.data()
  })
  comment.comments.forEach(comment => {
    ids.push(comment)
  })

  return ids
}

async function hasChildren(commentID) {
  let bool = false
  let comment = await getComment(commentID)
  if(comment.comments.length > 0) {
    bool = true
  }
  return bool
}

async function incrementKarma(commentID, num) {
  let comment = await getComment(commentID)
 
  db.collection("comments").doc(commentID).update({
    votes: comment.votes + num
  })
}

async function decrementKarma(commentID, num) {
  let comment = await getComment(commentID)

  db.collection("comments").doc(commentID).update({
    votes: comment.votes - num
  })
}

// for two below -> to get doc id for purposes of appending it to posts or other comments do -> let newComment = db.collection("comments").doc(), then you can do newComment.id and then newComment.set(data)
function createComment(comment, postID) {
  db.collection("comments").add(comment).then(docRef => {
    appendComment(postID, docRef.id)
  })
}

async function replyToComment(comment, idToReplyTo) {
  // call create comment then append its id to reply
  let newID
  await db.collection("comments").add({
    content: comment.content,
    author: comment.author,
    comments: [],
    votes: 0
  }).then(docRef => {
    newID = docRef.id
    db.collection("comments").doc(idToReplyTo).update({
      comments: firebase.firestore.FieldValue.arrayUnion(newID)
    })
  })

  return newID  
}

// use new Promise to force waiting for all children
async function getTotalComments(postID) {

  async function checkChildren(commentID) {
    let children = []
    let bool = await hasChildren(commentID)
    if (bool) {
      await getChildComments(commentID).then(async function (comments) {
        for (const comment of comments) {
          children.push(comment)
          await checkChildren(comment)
        }
      })
    
      commentCount += children.length
    }
  }

  let post = {}
  let commentCount = 0
  await getPost(postID).then(response => {
    post = response
  })

  for (const commentID of post.comments) {
    commentCount += 1
    await checkChildren(commentID)
  }

  return commentCount

}

function deleteComment(commentID) {
  db.collection("comments").doc(commentID).update({
    votes: "disabled",
    content: "[deleted]"
  })
}

export { getComment, getTopLevelCommentIDs, getChildComments, hasChildren, incrementKarma, decrementKarma, createComment, replyToComment, getTotalComments, deleteComment }