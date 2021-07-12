import {db} from "../firebase"

async function getAllSubreddits() {
  let subs: object[]

  await db.collection("subreddits").get().then(query => {
    query.forEach(doc => {
      let sub = doc.data()
      sub["id"] = doc.id
      subs.push(sub)
    })
  }).then(()=>{return subs})
}

async function getSubredditInfo(subredditName: string) {
  let content = ""

  await db.collection("subreddits").doc(subredditName).get().then(doc => {
    let subreddit = doc.data()
    if (subreddit) {
      content = subreddit.description
    }
  })
  return content
}

async function addSubreddit(title: string, description: string) {
  db.collection("subreddits").doc(title).set({
    description: description
  })
}

async function subExists(title: string) {
  let bool = false
  await db.collection("subreddits").doc(title).get().then(doc => {
    if (doc.exists) {bool = true}
  })
  return bool
}

export { getAllSubreddits, getSubredditInfo, addSubreddit, subExists }