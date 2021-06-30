import React, { useState, useEffect, useContext } from 'react'
import { NavLink, useHistory } from "react-router-dom"
import { createUser, usernamePasswordExists, userExists } from "../API/users"
import { LoggedInContext } from '../App'

// Link to r/all, logo center, sign in/ sign up/ sign out
// receive signed in as prop

function Header(props) {
  const [signingIn, setSigningIn] = useState(false)
  const [signingUp, setSigningUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory()

  const loggedIn = useContext(LoggedInContext)

  useEffect(() => {
    window.addEventListener('click', (e)=>{
      if (e.target.id === 'form-bg') {
        setSigningUp(false)
        setSigningIn(false)
      }
    })
  }, [])

  function handleUsernameChange(e) {
    setUsername(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }

  function handleSignUp(e) {
    e.preventDefault()

    userExists(username).then(val => {
      if (val) {
        alert("That username is taken")
      } else {
        createUser(username, password)
        setSigningUp(false)
        props.signInFunc(username)
        history.push("/")
      }
    })
  }

  const signUpForm = (
    <div id="signup-form" className="absolute min-h-screen h-full p-2 w-full top-0">
      <div className="relative z-20 p-4 my-12 bg-white mx-auto max-w-80 w-full lg:w-2/5 border-2 rounded-xl border-black opacity-100">
      <h1 className="mb-2 text-2xl">Sign Up</h1>
        <form className="block" onSubmit={handleSignUp}>
          <label className="block">Username</label>
          <input className="border border-blue-600 rounded-lg p-1" value={username} onChange={handleUsernameChange} htmlFor="Username"></input>
          <label className="block">Password</label>
          <input className="border border-blue-600 rounded-lg p-1" value={password} onChange={handlePasswordChange} htmlFor="Password"></input>
          <input className="block text-center mx-auto my-2 border-2 border-blue-600 py-1 px-3 rounded-xl cursor-pointer hover:text-white hover:bg-blue-400 text-black bg-white" type="submit" value="Submit" />
        </form>
      </div>

      <div id="form-bg" className="w-full h-full absolute z-10 inset-0 bg-gray-300 opacity-90"></div>
    </div>
  )
  
  function handleSignIn(e) {
    e.preventDefault()
    
    usernamePasswordExists(username, password).then(val => {
      if (val) {
        props.signInFunc(username)
        setSigningIn(false)
        history.push("/")
      } else {
        alert("Invalid credentials")
      }
    })
  }
  
  const signInForm = (
    <div id="signin-form" className="absolute min-h-screen h-full p-2 w-full top-0">
      <div className="relative z-20 p-4 my-12 bg-white mx-auto max-w-80 w-full lg:w-2/5 border-2 rounded-xl border-black opacity-100">
      <h1 className="mb-2 text-2xl">Sign In</h1>
        <form className="block" onSubmit={handleSignIn}>
          <label className="block">Username</label>
          <input className="border border-blue-600 rounded-lg p-1" value={username} onChange={handleUsernameChange} for="Username"></input>
          <label className="block">Password</label>
          <input className="border border-blue-600 rounded-lg p-1" value={password} onChange={handlePasswordChange} for="Password"></input>
          <input className="block text-center mx-auto my-2 border-2 border-blue-600 py-1 px-3 rounded-xl cursor-pointer hover:text-white hover:bg-blue-400 text-black bg-white" type="submit" value="Submit" />
        </form>
      </div>

      <div id="form-bg" className="w-full h-full absolute z-10 inset-0 bg-gray-300 opacity-90"></div>
    </div>
  )

  return (
    <div className="relative w-full text-center bg-white z-50">
      <div className="border-b-2 border-black w-full lg:w-3/5 mx-auto text-center flex flex-col md:flex-row justify-around filter drop-shadow-lg">
      <div className="w-full mt-1">
        <NavLink to="/subreddits" activeClassName="text-red-400" className="hover:text-blue-600">Subreddits</NavLink>
      </div>  
        
      {/* Link to Home */}
      <NavLink exact to="/" activeClassName="text-red-400" className="order-first md:order-none text-2xl w-full cursor-pointer hover:text-blue-600">Reddit</NavLink>

      {loggedIn ? 
      <div className="flex justify-around w-full opacity-100">
        <span className="my-auto">Signed in as {localStorage.getItem("curr_user")}</span>
        <button onClick={()=>{props.signOutFunc()}} className="w-1/3 hover:text-blue-600">Sign Out</button>
      </div> :
      <div className="flex w-full justify-around opacity-100">
        <button onClick={()=>{setSigningIn(true)}} className="hover:text-blue-600">Sign In</button>
        <button onClick={()=>{setSigningUp(true)}} className="hover:text-blue-600">Sign Up</button>
      </div>
      }

      {signingIn ? signInForm : ""}
      {signingUp ? signUpForm : ""}
    </div>
    </div>
  )
}

export default Header
