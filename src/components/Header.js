import React, { useState } from 'react'

// Link to r/all, logo center, sign in/ sign up/ sign out
// receive signed in as prop

function Header(props) {
  const [signingIn, setSigningIn] = useState(false)
  const [signingUp, setSigningUp] = useState(false)


  function handleSignUp(e) {
    e.preventDefault()
    props.signInFunc()
    setSigningUp(false)
  }
  
  const signUpForm = (
    <div>
      <h1>Sign Up</h1>
      <form id="signup-form" onSubmit={handleSignUp}>
        <label>Username</label>
        <input></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
  
  function handleSignIn(e) {
    e.preventDefault()
    props.signInFunc()
    setSigningIn(false)
  }
  
  const signInForm = (
    <div className="absolute min-h-screen h-full w-full bg-gray-300 opacity-90 inset-0">
      <div className="p-4 my-12 bg-blue-300 mx-auto max-w-80 w-2/5 border-2 rounded-xl border-black">
      <h1 className="mb-2">Sign In</h1>
        <form id="signin-form" className="block" onSubmit={handleSignIn}>
          <label className="block">Username</label>
          <input className="" for="Username"></input>
          <label className="block">Password</label>
          <input className="" for="Password"></input>
          <input className="block text-center mx-auto my-2 border-2 border-blue-600 py-1 px-3 rounded-xl cursor-pointer hover:text-white hover:bg-blue-400 text-black bg-white" type="submit" value="Submit" />
        </form>
      </div>
    </div>
  )

  return (
    <div className="border-b-2 border-black w-3/5 mx-auto text-center flex justify-around shadow-lg">
      <div className="w-1/3 mt-1">
        <button className="hover:text-blue-600">Subreddits</button>
      </div>  
        
      {/* Link to Home */}
      <h1 className="text-2xl w-1/3 cursor-pointer hover:text-blue-600">Reddit</h1>

      {props.signedIn ? 
      <button onClick={()=>{props.signOutFunc()}} className="w-1/3 hover:text-blue-600">Sign Out</button> :
      <div className="flex justify-around w-1/3">
        <button onClick={()=>{setSigningIn(true)}} className="hover:text-blue-600">Sign In</button>
        <button onClick={()=>{}} className="hover:text-blue-600">Sign Up</button>
      </div>
      }

      {signingIn ? signInForm : ""}
      {signingUp ? signUpForm : ""}
    </div>
  )
}

export default Header
