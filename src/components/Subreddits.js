import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
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
        return (
        <div>
          <Link to={'/' + sub}>
            {sub}
          </Link>
        </div>
        )
        // getSubInfo(sub) -> then put other info in here
      })}
    </div>
  )
}

export default Subreddits
