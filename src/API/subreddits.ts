import {db} from "../firebase"
import { SubredditInterface } from "./interfaces"

async function getAllSubreddits(): Promise<SubredditInterface[]> {
  let subs: SubredditInterface[] = []

  await db.collection("subreddits").get().then(query => {
    query.forEach(doc => {
      let sub = doc.data() as SubredditInterface
      sub["id"] = doc.id
      subs.push(sub)
    })
  })
  return subs
}

async function getSubredditInfo(subredditName: string): Promise<string> {
  let content = ""

  await db.collection("subreddits").doc(subredditName).get().then(doc => {
    let subreddit = doc.data()
    if (subreddit) {
      content = subreddit.description
    }
  })
  return content
}

async function addSubreddit(title: string, description: string): Promise<void> {
  db.collection("subreddits").doc(title).set({
    description: description
  })
}

async function subExists(title: string): Promise<boolean> {
  let bool = false
  await db.collection("subreddits").doc(title).get().then(doc => {
    if (doc.exists) {bool = true}
  })
  return bool
}

export { getAllSubreddits, getSubredditInfo, addSubreddit, subExists }