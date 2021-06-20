* = maybe

users {
  username :unique, use as id
  password
  upvotes - contains post ids
  funcs {
    
  }
}

comment hierarchy {
  post {
    top level comments (comments is posts comment array) {
      for each comment in this level of nesting and below ... make nested comments
    }
  }
}

comment components thoughts
  <Comment />
  state for child comments i.e -> const [commentChildren, set...] = useState(get comments for this child)


# Users
  ## features
    login/signup
    profile pic
    make posts
    up/downvote stuff, keep track of upvotes, cant allow infinite voting
    * following other users or following subs 
    * if subreddits, follow subs


  ## functions
    getUser(username)


# Posts
  ## features
    author
    title
    content - must have text body, optional image
    comments
    votes
    ! Definitely want r/all to be able to sort by top and new

  ## functions


# Comments
  ## features
    author,
    body,
    votes

  ## functions


# Subreddits
  ## features
    groups post
    can go to an individual sub to see only posts from there

