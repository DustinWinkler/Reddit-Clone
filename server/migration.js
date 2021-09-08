import firebase from "firebase/app"
import {db} from '../src/firebase.js'
import mongoose from 'mongoose';

const mongo = process.env.MONGO_URL
mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true})
const mongodb = mongoose.connection
mongodb.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Comments migration
