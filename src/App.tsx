import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Post from './components/Post'
import Header from './components/Header'
import Posts  from "./components/Posts"
import Subreddits from './components/Subreddits'
import Subreddit from './components/Subreddit'
import UserProfile from './components/UserProfile'

let bool = localStorage.getItem("userToken") ? true : false
export const LoggedInContext = createContext(bool)

function App() {
  const [userSignedIn, setUserSignedIn] = useState(false)

  useEffect(() => {
    setUserSignedIn(bool)
  }, [])

  function signOut() {
    setUserSignedIn(false)
    localStorage.removeItem("userToken")
  }

  function signIn(token: string) {
    setUserSignedIn(true)
    localStorage.setItem("userToken", token)
  }

  return (
    <LoggedInContext.Provider value={userSignedIn}>
      <Router>        
        <Header signOutFunc={signOut} signInFunc={signIn} />
        <Switch>
          <Route exact path='/' component={Posts} />
          <Route exact path='/subreddits' component={Subreddits} />
          <Route exact path='/users/:userid' component={UserProfile} />
          <Route path='/:subredditid/comments/:postid' component={Post} />
          <Route exact path='/:subreddit' component={Subreddit} />
        </Switch>
      </Router>
    </LoggedInContext.Provider>
  );
}

export default App;
