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

export { getSubredditsList }