import {db} from "../firebase"

async function getPosts(subreddit) {
  let posts = []
  if (subreddit === 'all' || subreddit === "") {
    await db.collection('posts').get().then(query => {
      query.forEach(doc => {
        console.log("post -> ", doc.data())
        posts.push(doc.data())
      })
    })
  } else {
    await db.collection('posts').where('subreddit', '==', subreddit).get().then(query => {
      query.forEach(doc => {
        console.log("post -> ", doc.data())
        posts.push(doc.data())
      })
    })
  }
  console.log('get posts return -> ', posts)
  return posts
}

export { getPosts }