import Post from '../models/posts.js'
import User from '../models/users.js'
import Comment from '../models/comments.js'
import passport from 'passport'
import bcrypt from 'bcrypt'

import express from 'express';
var router = express.Router();
// ROUTES AND CONTROLLERS

// ------------ POSTS ----------------

router.get('/posts', async (req, res, next) => {
  const blogs = await Post.find({}).populate('author')
  res.json(blogs)
})

// SPECIFIC POST
router.get('/posts/:postid', async (req, res) => {
  const blog = await Post.findById(req.params.postid).populate('author').populate('comments')
  res.json(blog)
})
// CREATE POST (PROTECTED!!)
router.post('/posts', async (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else if (!user.isAdmin) {res.status(401).send('Only admins can create posts')}
    else {
      const newPost = await Post.create(req.body)
      res.json(newPost)
    }
    
  })(req, res, next)
})
// UPDATE POST (PROTECTED!!)
router.put('/posts/:postid', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else if (!user.isAdmin) {res.status(401).send('Only admins can edit posts')}
    else {
      const post = await Post.findById(req.params.postid)
      post.title = req.body.title
      post.content = req.body.content
      post.save()
      res.json({message: 'Post successfully updated!', post})
    }
  })(req, res, next)
})
// DELETE POST (PROTECTED!!)
router.delete('/posts/:postid', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else if (!user.isAdmin) {
      res.status(401).send('Only admins can delete posts')
    }
    else {
      const post = await Post.findById(req.params.postid)
      if (!post) {res.status(404).send("That post doesn't exist")}
      else {
        post.comments.forEach(comment => {
          Comment.findOneAndDelete({_id: comment}).exec()
        })
        Post.findOneAndDelete({_id: req.params.postid}).exec()
        res.json({message: 'Post successfully deleted!', post})
      }
    }
  })(req, res, next)
})

// ------------ COMMENTS ----------------

// GET ALL COMMENTS FOR POST
router.get('/posts/:postid/comments', async (req, res) => {
  const post = await Post.findById(req.params.postid).populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'User'
    }
  })
  res.json(post.comments)
})

// CREATE COMMENT (PROTECTED!!)
router.post('/posts/:postid/comments', async (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else {
      const post = await Post.findById(req.params.postid)
      const newComment = await Comment.create({
        author: user._id,
        content: req.body.content
      })
      post.comments = [...post.comments, newComment]
      post.save()
      res.json({message: 'Comment successfully created!', newComment, post})
    }
  })(req, res, next)
})

// UPDATE COMMENT (PROTECTED!!)
router.put('/posts/:postid/comments/:commentid', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else {
      const comment = await Comment.findById(req.params.commentid)
      if (!comment) {res.status(404).send('Comment not found')}
      else if ((user._id.toString() !== comment.author.toString()) || (!user.isAdmin)) {
        res.status(401).send('Only the author of a comment, or an admin, can modify it!')
      }
      else {
        const comment = await Comment.findById(req.params.commentid)
        comment.content = req.body.content
        comment.save()
        res.json({message: 'Comment successfully updated!', comment})
      }
      
    }
  })(req, res, next)
})

// DELETE COMMENT (PROTECTED!!)
router.delete('/posts/:postid/comments/:commentid', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else {
      const comment = await Comment.findById(req.params.commentid)
      if (!comment) {res.status(404).send('Comment not found')}
      else if ((user._id.toString() !== comment.author.toString()) || (!user.isAdmin)) {
        res.status(401).send('Only the author of a comment, or an admin, can delete it!')
      }
      else {
        const post = await Post.findById(req.params.postid)
        post.comments = post.comments.filter(comment => comment.toString() !== req.params.commentid)
        post.save()
        const comment = await Comment.findByIdAndDelete(req.params.commentid).exec()
        res.json({message: 'Comment successfully deleted!', comment})
      }
      
    }
  })(req, res, next)
})

// ------------ USERS ----------------

// CREATE USER
router.post('/signup', passport.authenticate('signup', {session: false}),
 async (req, res, next) => {
  res.json({message: 'Signup successful!', user: req.user})
})

// LOGIN USER
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) { return next(new Error('An error occurred'))}
      
      req.login(user, {session: false}, async (error) => {
        if (error) {return next(error)}
        const token = user.generateAuthToken()
        return res.json({token})
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

// UPDATE USER (PROTECTED!!)
router.put('/users/:userid', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else if ((user._id.toString() !== req.params.userid) && (!user.isAdmin)) {
      res.status(401).send('Only the given user or an admin can update a user')
    }
    else {
      const userr = await User.findById(req.params.userid)
      userr.username = req.body.username
      if (req.body.password) {
        const passwordSame = await bcrypt.compare(req.body.password, user.password)
  
        if (!passwordSame) {
          userr.password = await bcrypt.hash(req.body.password, 10)
        }
      }
  
      userr.save()
      res.json({message: 'User successfully updated!', user: userr})
    }
    
  })(req, res, next)
})

router.get('/getuserdetails', (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (err, user, info) => {
    if (err || !user) {res.status(401).send('Auth failed')}
    else {
      const details = {
        username: user.username,
        id: user._id,
        isAdmin: user.isAdmin
      }
      res.json(details)
    }
    
  })(req, res, next)
})

// DELETE USER (PROTECTED!!)
// router.delete('/users/:userid', (req, res) => {
//   passport.authenticate('jwt', {session: false}, async (err, user, info) => {
//     if (err || !user) {res.status(401).send('Auth failed')}
//     if ((user._id !== req.params.userid) || (!user.isAdmin)) {
//       res.status(401).send('Only the given user or an admin can update a user')
//     }

//     User.findByIdAndDelete(req.params.userid)
//   })(req, res, next)
// })

export default router;