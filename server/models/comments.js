import mongoose from "mongoose";

const Schema = mongoose.Schema

const CommentSchema = new Schema ({
  content: String,
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  votes: Number
}, {timestamps: true})

const Comment = mongoose.model('Comment', CommentSchema)
export default Comment