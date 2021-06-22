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

async function addSubreddit(name, description) {

}

export { getAllSubreddits, getSubredditInfo, addSubreddit }