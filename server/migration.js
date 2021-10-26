import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import Comment from './models/comments.js'
import Post from './models/posts.js'
import Subreddit from './models/subreddit.js'
import User from './models/users.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: __dirname+'/.env'})

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "reddit-clone-68c40.firebaseapp.com",
  projectId: "reddit-clone-68c40",
  storageBucket: "reddit-clone-68c40.appspot.com",
  messagingSenderId: "951126470027",
  appId: "1:951126470027:web:356af8d63d41ebb2cbd38e",
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const mongo = process.env.MONGO_URL
mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true})
const mongodb = mongoose.connection
mongodb.on('error', console.error.bind(console, 'MongoDB connection error: '))

// flow is as follows
// migrate users, skipping votedIDs, converting posts to oldPostIDs -> 
// migrate subreddits -> 
// migrate posts, storing oldID on object for later reference, converting subreddit from title reference to subreddit._id ref, converting author from username ref to user._id ref -> 
// migrate comments, storing oldID for later reference, skipping nested comments, converting from username reference to user._id reference ->
// migrate nested comments ->
// convert user votedIDs from old ids to new

// Users migration

async function migrateUsers() {
  await getDocs(collection(db, 'users')).then(docs => {
    docs.forEach( async (doc) => {
      // console.log(doc.data())
      const user = doc.data()
      user.upvotedIDs = []
      user.downvotedIDs = []
      user.posts = undefined
      user.username = doc.id
      user.password = await bcrypt.hash(user.password, 10)
      const mongoUser = await User.create(user)
      console.log(user);
      console.log(mongoUser);
    })
  })
}
//migrateUsers()

// Subreddit migration

async function migrateSubreddits() {
  await getDocs(collection(db, 'subreddits')).then(docs => {
    docs.forEach(async (doc) => {
      const subreddit = doc.data()
      subreddit.title = doc.id
      const mongoSubreddit = await Subreddit.create(subreddit)
      console.log(subreddit);
      console.log(mongoSubreddit);
    })
  })
}
//migrateSubreddits()

// Post migration

async function migratePosts() {
  await getDocs(collection(db, 'posts')).then(docs => {
    docs.forEach(async (doc) => {
      const post = doc.data()
      post.oldCommentIDs = post.comments
      post.comments = []
      
      const subreddit = await Subreddit.findOne({title: post.subreddit})
      const author = await User.findOne({username: post.author})

      post.subreddit = subreddit._id
      post.author = author._id

      const mongoPost = await Post.create(post)

      //console.log('author', author);
      console.log('mongoPost', mongoPost);
      console.log('post', doc.id, post);
    })
  })
}
//migratePosts()

// Comments migration

async function migrateComments() {
  await getDocs(collection(db, 'comments')).then(doc => {
    doc.forEach( async (doc) => {
      const comment = doc.data()
      comment.oldID = doc.id
      comment.oldCommentIDs = comment.comments
      comment.comments = []

      const author = await User.findOne({username: comment.author})
      let authorID = (author ? author._id : '613a710a2f0bc125f397c0cf')

      comment.author = authorID
      const mongoComment = await Comment.create(comment)
      console.log(comment)
    })
  })
}
//migrateComments()

// Comments on Posts conversion

async function convertCommentsOnPosts() {
  Post.find({}).then(posts => {
    posts.forEach(async (post) => {
      post.comments = []

      await Promise.all(post.oldCommentIDs.map(async (id) => {
        const fireComment = (await getDoc(doc(db, 'comments', id))).data()
        const mongoComment = await Comment.findOne({content: fireComment.content})
        post.comments = [...post.comments, mongoComment._id]
        console.log('in progress', post.comments);
      }))
      post.oldCommentIDs = undefined
      console.log('done', post.comments);
      post.save()
    })
  })
}
convertCommentsOnPosts()

// Comments on comments conversion from old ids

async function convertNestedComments() {
  Comment.find({}).then(comments => {
    comments.forEach( async (comment) => {
      if (comment.oldCommentIDs.length > 0) {
        comment.oldCommentIDs.forEach(async (id) => {
          const refComment = await Comment.findOne({oldID: id})
          comment.comments = [...comment.comments, refComment._id]
          comment.oldCommentIDs = undefined
          comment.oldID = undefined
          comment.save()
          console.log(comment);
        })
      } else {
        comment.oldCommentIDs = undefined
        comment.oldID = undefined
        comment.save()
        console.log(comment);
      }
    })
  })
}
//convertNestedComments()

// Convert user votedIDs
async function convertUserVotedIDs() {
  User.find({}).then(async (users) => {
    users.forEach(async (user) => {
      const fireUser = (await getDoc(doc(db, 'users', user.username))).data()
      if (fireUser) {
        fireUser.upvotedIDs.forEach(async (id) => {
          const fireComment = (await getDoc(doc(db, 'comments', id))).data()
          if (fireComment) {
            const mongoComment = await Comment.findOne({content: fireComment.content})
            user.upvotedIDs = [...user.upvotedIDs, mongoComment._id]
            console.log(user.upvotedIDs);
          }

          const firePost = (await getDoc(doc(db, 'posts', id))).data()
          if (firePost) {
            const mongoPost = await Post.findOne({content: firePost.content})
            user.upvotedIDs = [...user.upvotedIDs, mongoPost._id]
          }
        })

        fireUser.downvotedIDs.forEach(async (id) => {
          const fireComment = (await getDoc(doc(db, 'comments', id))).data()
          if (fireComment) {
            const mongoComment = await Comment.findOne({content: fireComment.content})
            user.downvotedIDs = [...user.downvotedIDs, mongoComment._id]
          }

          const firePost = (await getDoc(doc(db, 'posts', id))).data()
          if (firePost) {
            const mongoPost = await Post.findOne({content: firePost.content})
            user.downvotedIDs = [...user.downvotedIDs, mongoPost._id]
          }
        })
      }
      //console.log(fireUser);
      //console.log('userHasUpvotedIDs', (user.upvotedIDs.length > 0 ? true:false))
      setTimeout(() => {
        user.save()
      }, 5000);
    })
  })
}
//convertUserVotedIDs()