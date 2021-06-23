import { comment } from 'postcss'
import {db} from '../firebase'
import {getPost} from "./posts"

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
async function createComment(content) {

}

async function replyToComment(content, idToReplyTo) {
  // call create comment then append its id to reply
}

async function getTotalComments(postID) {

  async function checkChildren(commentID) {
    let children = []
    let bool = await hasChildren(commentID)
    if (bool) {
      await getChildComments(commentID).then(comments => {
        comments.forEach(comment => {
          children.push(comment)
          checkChildren(comment)
        })
      })
    
      commentCount += children.length
    }
  }

  let post = {}
  let commentCount = 0
  await getPost(postID).then(response => {
    post = response
  })

  console.log("post comments -> ", post.comments)

  for (const commentID of post.comments) {
    commentCount += 1
    await checkChildren(commentID)
  }

  return commentCount

}

export { getComment, getTopLevelCommentIDs, getChildComments, hasChildren, incrementKarma, decrementKarma, createComment, replyToComment, getTotalComments }