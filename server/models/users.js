import mongoose from "mongoose";
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema

const UserSchema = new Schema ({
  username: {type: String, required: true, minLength: 3, unique: true},
  password: {type: String, required: true, minLength: 3, unique: true},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  isAdmin: Boolean
})

UserSchema.methods.generateAuthToken = function() {
  return jsonwebtoken.sign({
    _id: this._id,
    username: this.username,
    password: this.password
  }, process.env.AUTH_SECRET)
}

UserSchema.methods.isValidPassword = async function(password) {
  const valid = await bcrypt.compare(password, this.password)
  return valid
}

const User = mongoose.model('User', UserSchema)
export default User