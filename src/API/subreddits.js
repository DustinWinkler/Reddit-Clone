import {db} from "../firebase"

async function getAllSubreddits() {
  let subs = []

  await db.collection("subreddits").get().then(query => {
    query.forEach(doc => {
      let sub = doc.data()
      sub["id"] = doc.id
      subs.push(sub)
    })
  })
  return subs
}

async function getSubredditInfo(subredditName) {
  let content = ""

  await db.collection("subreddits").doc(subredditName).get().then(doc => {
    let subreddit = doc.data()
    content = subreddit.description
  })
  console.log("getsubinfo content -> ", content)
  return content
}

async function addSubreddit(title, description) {
  db.collection("subreddits").doc(title).set({
    description: description
  })
}

async function subExists(title) {
  let bool = false
  await db.collection("subreddits").doc(title).get().then(doc => {
    if (doc.exists) {bool = true}
  })
  return bool
}

export { getAllSubreddits, getSubredditInfo, addSubreddit, subExists }