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
  // comments.length and then recursively check for children on those
}

export { getComment, getTopLevelCommentIDs, getChildComments, hasChildren, incrementKarma, decrementKarma }