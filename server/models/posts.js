import mongoose from "mongoose";

const Schema = mongoose.Schema

const PostSchema = new Schema ({
  title: String,
  content: String,
  votes: Number,
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  subreddit: {type: Schema.Types.ObjectId, ref: 'Subreddit'},
  type: {type: String, enum: ['Link', 'Image', 'Video', 'Text']},
  fileURL: String
}, {timestamps: true})

function populateInfo(next) {
  this.populate('author')
  this.populate('subreddit')
  next()
}

PostSchema.pre('find', populateInfo)
PostSchema.pre('findOne', populateInfo)

const Post = mongoose.model('Post', PostSchema)
export default Post