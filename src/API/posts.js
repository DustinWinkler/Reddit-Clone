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
  console.log('get posts return -> ', posts)
  return posts
}

async function getPost(postID) {
  let post = {}
  await db.collection("posts").doc(postID).get().then(doc => {
    post = doc.data()
    post["id"] = doc.id
  })
  console.log("return from getPost -> ", post)
  return post
}

export { getPosts, getPost }