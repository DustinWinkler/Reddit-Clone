import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const resolvers = {
  Query: {
    postsForHome: async (_, __, { Post }) => {
      const posts = await Post.find({})
      return posts
    },

    postsForUser: async (_, { ID }, { Post }) => {
      const posts = await Post.find({ author: ID })
      return posts
    },

    postsForSubreddit: async (_, { ID }, { Post }) => {
      const posts = await Post.find({ subreddit: ID })
      return posts
    },

    post: async (_, { ID }, { Post }) => {
      const post = await Post.findById(ID)
      return post
    },

    comment: async (_, { ID }, { Comment }) => {
      let comment = await Comment.findById(ID)
      return comment
    },

    subreddits: async (_, __, { Subreddit, currentUser }) => {
      const subs = await Subreddit.find({})
      return subs
    },

    subreddit: async (_, { ID }, { Subreddit }) => {
      const sub = await Subreddit.findById(ID)
      return sub
    },

    userDetails: async (_, { ID }, { User }) => {
      const user = await User.findById(ID)
      return user
    },

    currentUserDetails: async (_, __, { currentUser }) => {
      return currentUser
    }
  },
  Mutation: {
    login: async (_, {loginInfo: { username, password }}, { User }) => {
      const user = await User.findOne({ username })
      if (user) {
        const passwordVerified = await bcrypt.compare(password, user.password)

        if (passwordVerified) {
          const token = jwt.sign({
            username: user.username,
            upvotedIDs: user.upvotedIDs,
            downvotedIDs: user.downvotedIDs,
            id: user.id
          }, process.env.AUTH_SECRET, { algorithm: 'HS256'})
          return { 
            token,
            success: true,
            userDetails: {
              username,
              id: user.id
            } 
          }
        }
        if (!passwordVerified) {
          return {
            success: false,
            errors: [
              {
                message: 'Invalid Credentials'
              }
            ]
          }
        }
      }
      if (!user) return { 
          errors: [
            {
              message: 'Invalid Credentials'
            }
          ]
        }
      
    },

    signup: async (_, { signupInfo: { username, password }}, { User }) => {
      const hashedPW = await bcrypt.hash(password, 10)

      let user

      try {
        user = await User.create({
          username,
          password: hashedPW
        })
      } catch {
        user = false
      }

      if (!user) return {
        success: false,
        errors: [
          {message: "That username is taken"}
        ]
      }

      const token = jwt.sign({
        username: user.username,
        upvotedIDs: user.upvotedIDs,
        downvotedIDs: user.downvotedIDs,
        id: user.id
      }, process.env.AUTH_SECRET, { algorithm: 'HS256'})

      return {
        token,
        success: true,
        userDetails: {
          username,
          id: user.id
        }
      }
    },

    createPost: async (_, { postInfo }, { Post, User, currentUser }) => {
      let post = postInfo
      post.comments = []
      post.author = currentUser.id
      post.votes = 0
      const createdPost = await Post.create(post)
      let returnPost = await Post.findById(createdPost._id)
      return returnPost
    },

    createComment: async (_, { commentInfo, parentID, parentType }, { Comment, Post, currentUser }) => {
      let comment = commentInfo
      comment.votes = 0
      comment.author = currentUser.id
      comment.comments = []
      const createdComment = await Comment.create(comment)

      let parent

      if (parentType === "post") {
        parent = await Post.findById(parentID)
      }

      if (parentType === "comment") {
        parent = await Comment.findById(parentID)
      }

      parent.comments.push(createdComment.id)
      parent.save()

      const returnComment = await Comment.findById(createdComment._id)

      return returnComment
    },

    createSubreddit: async (_, { subredditInfo }, { Subreddit }) => {
      const createdSubreddit = await Subreddit.create(subredditInfo)
      return createdSubreddit
    },

    updatePost: async (_, { postObject }, { Post, currentUser }) => {
      // not currently used in frontend, might revisit
    },

    updateComment: async (_, { commentObject }, { Comment, currentUser }) => {
      // not currently used in frontend, might revisit
    },
    deletePost: async (_, { ID }, { Post, currentUser }) => {
      if (currentUser === undefined) return {
        success: false,
        message: "User not logged in"
      }
      
      const post = await Post.findById(ID)
      const verifiedUser = post.author._id.toString() === currentUser.id
      console.log(verifiedUser, post.author._id, currentUser.id);
      if (verifiedUser) {
        let post = await Post.findById(ID)
        post.delete()
        return {
          success: true,
          message: "Post deleted."
        }
      } else {
        return {
          success: false,
          message: "You are not the author of that post."
        }
      }
    },

    deleteComment: async (_, { ID }, { Comment, Post, currentUser }) => {
      if (currentUser === undefined) return {
        success: false,
        message: "User not logged in"
      }
      
      const comment = await Comment.findById(ID).populate('author')

      if (!comment) return {
        success: false,
        message: "Comment not found"
      }

      const verifiedUser = comment.author._id.toString() === currentUser.id

      if (verifiedUser) {
        let parent
        parent = await Comment.findOne({comments: comment._id})
        if (!parent) parent = await Post.findOne({ comments: comment._id})
        parent.comments.splice(parent.comments.indexOf(comment._id), 1)
        parent.save()
        comment.delete()

        return {
          success: true,
          message: "Comment deleted."
        }
      } else {
        return {
          success: false,
          message: "You are not the author of that comment."
        }
      }
    },

    upvoteItem: async (_, { ID }, { Post, Comment, User, currentUser}) => {
      if (!currentUser) return { success: false, message: "not logged in"}
      let [comment, post] = await Promise.all([
        new Promise(res => {
          let comment = Comment.findById(ID)
          res(comment)
        }),
        new Promise(res => {
          let post = Post.findById(ID)
          res(post)
        })
      ])
      
      let userFromDB = await User.findById(currentUser.id)

      let newDownvotes = userFromDB.downvotedIDs
      let newUpvotes = userFromDB.upvotedIDs
      let hadUpvoted, hadDownvoted

      if (userFromDB.downvotedIDs.includes(ID)) {
        let index = userFromDB.downvotedIDs.indexOf(ID)
        newDownvotes.splice(index, 1)
        hadDownvoted = true
      } else { hadDownvoted = false }

      if (userFromDB.upvotedIDs.includes(ID)) {
        let index = userFromDB.downvotedIDs.indexOf(ID)
        newUpvotes.splice(index, 1)
        hadUpvoted = true
      } else { hadUpvoted = false }

      if (hadDownvoted) {
        comment ? comment.votes += 1 : comment = false
        post ? post.votes += 1 : post = false
      }

      if (hadUpvoted) {
        comment ? comment.votes -= 1 : comment = false
        post ? post.votes -= 1 : post = false
      } else {
        comment ? comment.votes += 1 : comment = false
        post ? post.votes += 1 : post = false
      }

      if (comment) comment.save() 
      if (post) post.save()

      let newUser = currentUser
      newUser.upvotedIDs = newUpvotes
      if (!hadUpvoted) newUser.upvotedIDs.push(ID)
      newUser.downvotedIDs = newDownvotes
      const newToken = jwt.sign(newUser, process.env.AUTH_SECRET, { algorithm: 'HS256'})


      userFromDB.upvotedIDs = newUser.upvotedIDs
      userFromDB.downvotedIDs = newUser.downvotedIDs
      userFromDB.save()

      return {
        newToken,
        success: true,
        message: "changed vote status"
      }
    },

    downvoteItem: async (_, { ID }, { Post, Comment, User, currentUser}) => {
      if (!currentUser) return { success: false, message: "not logged in"}
      let [comment, post] = await Promise.all([
        new Promise(res => {
          let comment = Comment.findById(ID)
          res(comment)
        }),
        new Promise(res => {
          let post = Post.findById(ID)
          res(post)
        })
      ])

      let userFromDB = await User.findById(currentUser.id)

      let newDownvotes = userFromDB.downvotedIDs
      let newUpvotes = userFromDB.upvotedIDs
      let hadUpvoted, hadDownvoted

      if (userFromDB.downvotedIDs.includes(ID)) {
        let index = userFromDB.downvotedIDs.indexOf(ID)
        newDownvotes.splice(index, 1)
        hadDownvoted = true
      } else { hadDownvoted = false }

      if (userFromDB.upvotedIDs.includes(ID)) {
        let index = userFromDB.downvotedIDs.indexOf(ID)
        newUpvotes.splice(index, 1)
        hadUpvoted = true
      } else { hadUpvoted = false }

      if (hadDownvoted) {
        comment ? comment.votes += 1 : comment = false
        post ? post.votes += 1 : post = false
      } else {
        comment ? comment.votes -= 1 : comment = false
        post ? post.votes -= 1 : post = false
      }

      if (hadUpvoted) {
        comment ? comment.votes -= 1 : comment = false
        post ? post.votes -= 1 : post = false
      }

      if (comment) comment.save() 
      if (post) post.save()

      let newUser = currentUser
      newUser.upvotedIDs = newUpvotes
      newUser.downvotedIDs = newDownvotes
      if (!hadDownvoted) newUser.downvotedIDs.push(ID)
      const newToken = jwt.sign(newUser, process.env.AUTH_SECRET, { algorithm: 'HS256'})

      userFromDB.upvotedIDs = newUser.upvotedIDs
      userFromDB.downvotedIDs = newUser.downvotedIDs
      userFromDB.save()

      return {
        newToken,
        success: true,
        message: "changed vote status"
      }
    },
  },

  Post: {
    totalComments: async (parent, __, { Comment }) => {
      let count = 0

      await Promise.all(parent.comments.map(async (comment) => {
        count++
        await commentsComments(comment._id)
      }))

      async function commentsComments(commentID) {
        const comment = await Comment.findById(commentID)

        await Promise.all(comment.comments.map(async (comment) => {
          count++
          await commentsComments(comment._id)
        }))
      }
      return count
    }
  }
}

export default resolvers