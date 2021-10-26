import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema

const UserSchema = new Schema ({
  username: {type: String, required: true, minLength: 3, unique: true},
  password: {type: String, required: true, minLength: 3},
  upvotedIDs: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  downvotedIDs: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  oldUpIDs: [String],
  oldDownIDs: [String]
})

UserSchema.methods.isValidPassword = async function(password) {
  const valid = await bcrypt.compare(password, this.password)
  return valid
}

const User = mongoose.model('User', UserSchema)
export default User