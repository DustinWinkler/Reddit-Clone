* = maybe

users {
  username :unique, use as id
  password
  upvotes - contains post ids
  funcs {
    
  }
}


post {
  id :unique
  title 
  content, img or text
  authorusername
  subredditid
  funcs {
    getComments(postid)
    postComment(postid)
  }
}

the two below need test entries in firestore

subreddit {
  creator
  aboutinfo
  funcs {
    getPosts(subredditid)
  }
}

comment {
  author
  content
  postid
  comments -> {
    commentid 
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

