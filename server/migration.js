import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

// Comments migration

async function getAllComments() {
  await getDocs(collection(db, 'comments')).then(doc => {
    doc.forEach(doc => console.log(doc.data()))
  })
}
getAllComments()

// Comments on comments conversion from old ids