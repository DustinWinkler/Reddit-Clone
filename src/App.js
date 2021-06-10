import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Header from './components/Header'

function App() {
  const [userSignedIn, setUserSignedIn] = useState(false)

  function signOut() {
    setUserSignedIn(false)
  }

  function signIn() {
    setUserSignedIn(true)
  }

  return (
    <div className="relative">
      <Header signOutFunc={signOut} signInFunc={signIn} signedIn={userSignedIn} />
    </div>
  );
}

export default App;
