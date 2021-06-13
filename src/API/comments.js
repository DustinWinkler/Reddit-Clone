import {db} from '../firebase'

async function getTopLevelComments(postID) {
  console.log(postID)
  let post = await db.collection("posts").doc(postID)

  console.log(post.comments)
}

async function getChildComments(commentID) {

}

export { getTopLevelComments, getChildComments }