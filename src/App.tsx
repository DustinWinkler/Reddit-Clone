import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom"
import Comments from './components/Comments'
import Header from './components/Header'
import Posts  from "./components/Posts"
import Subreddits from './components/Subreddits'
import Subreddit from './components/Subreddit'
import UserProfile from './components/UserProfile'
import { getUserInfo } from "./API/users"

let bool = localStorage.getItem("curr_user") ? true : false
export const LoggedInContext = createContext(bool)

function App() {
  const [userSignedIn, setUserSignedIn] = useState(false)

  const history = useHistory()

  useEffect(() => {
    // check if signed in, if true, set the state to be so
    if(localStorage.getItem("curr_user") !== null) {
      let username = localStorage.getItem("curr_user")
      if (typeof username === 'string') {signIn(username)}
    }
  }, [])

  function signOut() {
    setUserSignedIn(false)
    localStorage.removeItem("curr_user")
    history.push("/")
  }

  function signIn(username: string) {
    localStorage.setItem('curr_user', username)
    getUserInfo(username).then(user => localStorage.setItem("userInfo", JSON.stringify(user)))
    setUserSignedIn(true)
  }

  return (
    <LoggedInContext.Provider value={userSignedIn}>
      <Router>
        
        <Header signOutFunc={signOut} signInFunc={signIn} />

        <Switch>
          <Route exact path='/' component={Posts} />
          <Route path='/subreddits' component={Subreddits} />
          <Route exact path='/users/:username' component={UserProfile} />
          <Route path='/:subreddit/comments/:postid' component={Comments} />
          <Route exact path='/:subreddit' component={Subreddit} />
        </Switch>
        

      </Router>
      </LoggedInContext.Provider>
  );
}

export default App;
