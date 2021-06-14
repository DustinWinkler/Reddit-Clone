import {db} from '../firebase'

async function getUserInfo(username) {
  let user = {}
  let userRef = db.collection("users").doc(username);

  await userRef.get().then((doc) => {
    if (doc.exists) {
      user = doc.data()
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
    posts: []
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
  console.log("login user -> ", !!user.password)
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

async function incrementCommentKarma(username) {
  let userInfo = await getUserInfo(username)

  let userRef = db.collection("users").doc(username);
  userRef.update({
    commentkarma: userInfo.commentkarma + 1
  })

}

async function decrementCommentKarma(username) {
  let userInfo = await getUserInfo(username)

  let userRef = db.collection("users").doc(username);
  userRef.update({
    commentkarma: userInfo.commentkarma - 1
  })
}

async function incrementPostKarna(username) {
  let userInfo = await getUserInfo(username)

  let userRef = db.collection("users").doc(username)
  
  userRef.update({
    postkarma: userInfo.postkarma + 1
  })
}

async function decrementPostKarma(username) {
  let userInfo = await getUserInfo(username)

  let userRef = db.collection("users").doc(username)

  userRef.update({
    postkarma: userInfo.postkarma - 1
  })
}

export { getUserInfo, createUser, usernamePasswordExists, incrementCommentKarma, decrementCommentKarma, incrementPostKarna, decrementPostKarma, userExists }