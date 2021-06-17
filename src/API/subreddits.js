import {db} from "../firebase"

async function getSubredditsList() {
  let subs = []

  await db.collection("subreddits").get().then(query => {
    query.forEach(doc => {
      subs.push(doc.id)
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
  return content
}

async function createSubreddit(name, description) {

}

export { getSubredditsList, getSubredditInfo, createSubreddit }