import mongoose from "mongoose";

const Schema = mongoose.Schema

const SubredditSchema = new Schema ({
  description: String
})

const Subreddit = mongoose.model('Subreddit', SubredditSchema)
export default Subreddit