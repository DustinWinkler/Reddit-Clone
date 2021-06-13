import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Comments from './components/Comments';
import Header from './components/Header'
import Posts  from "./components/Posts";
import Subreddits from './components/Subreddits';
import firebase from './firebase'
import { getUserInfo, usernamePasswordExists } from "./API/users"

function App() {
  const [userSignedIn, setUserSignedIn] = useState(false)

  useEffect(() => {
    // use firestore sign up stuff/localstorage stuff
    getUserInfo("Jimmy")
  }, [])

  function signOut() {
    setUserSignedIn(false)
    // add localstorage clear
  }

  function signIn() {
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
        <Comments />
      </Route>
      
    </div>
    </Router>
  );
}

export default App;
