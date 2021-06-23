import {db} from "../firebase"

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

function addPost(post) {

}

export { getPosts, getPost, incrementKarma, decrementKarma, addPost }