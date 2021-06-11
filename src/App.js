import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Header from './components/Header'
import Posts  from "./components/Posts";
import Subreddits from './components/Subreddits';

function App() {
  const [userSignedIn, setUserSignedIn] = useState(false)

  function signOut() {
    setUserSignedIn(false)
  }

  function signIn() {
    setUserSignedIn(true)
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

      <Switch>

      </Switch>
      
    </div>
    </Router>
  );
}

export default App;
