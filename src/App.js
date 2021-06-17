import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Comments from './components/Comments';
import Header from './components/Header'
import Posts  from "./components/Posts";
import Subreddits from './components/Subreddits';
import firebase from './firebase'
import { getUserInfo, usernamePasswordExists } from "./API/users"
import { hasChildren } from "./API/comments"

function App() {
  const [userSignedIn, setUserSignedIn] = useState(false)

  useEffect(() => {
    // use firestore sign up stuff/localstorage stuff
    if(localStorage.getItem("curr_user") !== null) {
      signIn(localStorage.getItem("curr_user"))
    }
  }, [])

  function signOut() {
    setUserSignedIn(false)
    localStorage.removeItem("curr_user")
    // add localstorage clear
  }

  function signIn(username) {
    localStorage.setItem('curr_user', username)
    getUserInfo(username).then(user => localStorage.setItem("userInfo", JSON.stringify(user)))
    setUserSignedIn(true)
    // add localstorage setitem
  }

  return (
    // FIGURE OUT COMMENTS ROUTE STUFF ie localhost/*/comments/postid

    <Router>
      <div className="">
      <Header signOutFunc={signOut} signInFunc={signIn} signedIn={userSignedIn} />

      <Route exact path="/">
        <div>
        <Posts />
        </div>
      </Route>

      <Route exact path="/subreddits">
        <Subreddits />
      </Route>

      <Route path="/:subreddit/comments/:postid">
        <Comments loggedIn={userSignedIn} />
      </Route>
      
    </div>
    </Router>
  );
}

export default App;
