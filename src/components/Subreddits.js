import React from 'react'

function Subreddits() {
  const subs = require("../test-server.json").subreddits

  return (
    <div>
      weiner2
      {subs.map(sub => {
        return (<p>{sub}</p>)
        // getSubInfo(sub) -> then put other info in here
      })}
    </div>
  )
}

export default Subreddits
