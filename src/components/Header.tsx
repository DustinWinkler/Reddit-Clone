import React, { useState, useEffect, useContext, FC } from 'react'
import { NavLink } from "react-router-dom"
import { useMutation, useLazyQuery } from "@apollo/client"
import { LOGIN, SIGNUP } from '../GraphQL/mutations'
import { LoggedInContext } from '../App'
import { CURRENT_USER_DETAILS } from '../GraphQL/queries'

type HeaderProps = {
  signInFunc: Function,
  signOutFunc: Function
}

const Header: FC<HeaderProps> = ({ signInFunc, signOutFunc}) => {
  const [signingIn, setSigningIn] = useState(false)
  const [signingUp, setSigningUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentUserUsername, setCurrentUserUsername] = useState('')

  const loggedIn = useContext(LoggedInContext)

  const [ getUserDetails ] = useLazyQuery(CURRENT_USER_DETAILS, {
    onCompleted: ({ currentUserDetails: deets }) => {      
      if (deets?.username) {
        setCurrentUserUsername(deets.username)
      }
    }
  })

  const [ login, { error: loginError } ] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      if (login.success) {
        signInFunc(login.token)
        setCurrentUserUsername(username)
        setSigningIn(false)
      }
    },
    refetchQueries: [
      "currentUserDetails"
    ]
  })

  const [ signup, { error: signupError, data: signupData } ] = useMutation(SIGNUP, {
    onCompleted: ({ signup }) => {
      if (signup.success) {
        signInFunc(signup.token)
        setCurrentUserUsername(username)
        setSigningUp(false)
      }
    },
    refetchQueries: [
      "currentUserDetails"
    ]
  })

  useEffect(() => {
    if (loggedIn) getUserDetails()
  }, [loggedIn, getUserDetails])

  useEffect(() => {
    window.addEventListener('click', (e: Event)=>{
      const target = e.target as HTMLDivElement
      if (target.id === 'form-bg') {
        setSigningUp(false)
        setSigningIn(false)
      }
    })
  }, [])

  function handleUsernameChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setUsername(target.value)
  }

  function handlePasswordChange(e: React.FormEvent) {
    const target = e.target as HTMLInputElement
    setPassword(target.value)
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    signup({
      variables: {
        signupInfo: {
          username,
          password
        }
      }
    })
  }

  const signUpForm = (
    <div id="signup-form" className="absolute min-h-screen h-full p-2 w-full top-0">
      <div className="relative z-20 p-4 my-12 bg-white mx-auto max-w-80 w-full lg:w-2/5 border-2 rounded-xl border-black opacity-100">
      <h1 className="mb-2 text-2xl">Sign Up</h1>
        <form className="block" onSubmit={handleSignUp}>
          <label className="block">Username</label>
          <input className="border border-blue-600 rounded-lg p-1" value={username} onChange={handleUsernameChange} ></input>
          <label className="block">Password</label>
          <input className="border border-blue-600 rounded-lg p-1" value={password} onChange={handlePasswordChange} ></input>
          <input className="block text-center mx-auto my-2 border-2 border-blue-600 py-1 px-3 rounded-xl cursor-pointer hover:text-white hover:bg-blue-400 text-black bg-white" type="submit" value="Submit" />
        </form>
        {signupError && <p>There was an error signing up</p>}
        {signupData?.signup.errors.map((error: any, i: string) => {
          return <p key={i}>{error.message}</p>
        })}
      </div>
      <div id="form-bg" className="w-full h-full absolute z-10 inset-0 bg-gray-300 opacity-90"></div>
    </div>
  )
  
  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    login({
      variables: {
        loginInfo: {
          username,
          password
        }
      }
    })
  }
  
  const signInForm = (
    <div id="signin-form" className="absolute min-h-screen h-full p-2 w-full top-0">
      <div className="relative z-20 p-4 my-12 bg-white mx-auto max-w-80 w-full lg:w-2/5 border-2 rounded-xl border-black opacity-100">
      <h1 className="mb-2 text-2xl">Sign In</h1>
        <form className="block" onSubmit={handleSignIn}>
          <label className="block">Username</label>
          <input className="border border-blue-600 rounded-lg p-1" value={username} onChange={handleUsernameChange} ></input>
          <label className="block">Password</label>
          <input className="border border-blue-600 rounded-lg p-1" value={password} onChange={handlePasswordChange} ></input>
          <input className="block text-center mx-auto my-2 border-2 border-blue-600 py-1 px-3 rounded-xl cursor-pointer hover:text-white hover:bg-blue-400 text-black bg-white" type="submit" value="Submit" />
        </form>
        {loginError && <p>There was an error logging in</p>}
      </div>

      <div id="form-bg" className="w-full h-full absolute z-10 inset-0 bg-gray-300 opacity-90"></div>
    </div>
  )

  return (
    <div className="relative w-full border-b border-black text-center bg-white z-50">
      <div className="py-1 w-full lg:w-11/12 xl:w-4/5 mx-auto text-center flex flex-col md:flex-row justify-around">
      <div className="w-full mt-1">
        <NavLink to="/subreddits" activeClassName="text-blue-600" className="hover:text-blue-600">Subreddits</NavLink>
      </div>  
        
      {/* Link to Home */}
      <NavLink exact to="/" activeClassName="text-blue-600" className="order-first md:order-none text-2xl w-full cursor-pointer hover:text-blue-600">Reddit</NavLink>

      {loggedIn ? 
      <div className="flex justify-around w-full opacity-100">
        <span className="my-auto">Signed in as {currentUserUsername}</span>
        <button onClick={()=>{signOutFunc()}} className="w-1/3 hover:text-blue-600">Sign Out</button>
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
