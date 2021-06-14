import React, {useState, useEffect} from 'react'
import{ getSubredditsList } from "../API/subreddits"

function Subreddits() {
  const [subList, setSubList] = useState([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  
  useEffect(() => {
    getSubredditsList().then(list => {
      setSubList(list)
      setLoadingSubs(false)
    })
  }, []) 

  return (
    <div>
      { loadingSubs ? "Loading Subreddits" :
      subList.map(sub => {
        return (<p>{sub}</p>)
        // getSubInfo(sub) -> then put other info in here
      })}
    </div>
  )
}

export default Subreddits
