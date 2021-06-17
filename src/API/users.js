import {db} from '../firebase'

async function getUserInfo(username) {
  let user = {}
  let userRef = db.collection("users").doc(username);

  await userRef.get().then((doc) => {
    if (doc.exists) {
      user = doc.data()
      user["username"] = doc.id
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  return user

}

async function createUser(username, password) {
  db.collection("users").doc(username).set({
    commentkarma: 0,
    password: password,
    postkarma: 0,
    posts: [],
    downvotedIDs: [],
    upvotedIDs: []
  })
}

async function userExists(username) {
  let user = await getUserInfo(username)

  if (user.password) {
    return true
  } else {
    return false
  }
}

async function usernamePasswordExists(username, password) {
  let user = await getUserInfo(username)
  // if user exists
  if (user.password) {
    // if password matches
    if (user.password === password) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
  // test what user returns in console when doc doesnt exist

}

async function updateUser(username, user) {
  console.log("username -> ", username, "user -> ", user)
  db.collection("users").doc(username).update(user)

}

export { getUserInfo, createUser, usernamePasswordExists, userExists, updateUser }