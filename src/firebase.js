import firebase from 'firebase/app';
import 'firebase/firestore';
import '@firebase/auth';
import 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyAEib9DKtjzWuO7muOpS3xJMqIKth0DlPw",
  authDomain: "reddit-clone-68c40.firebaseapp.com",
  projectId: "reddit-clone-68c40",
  storageBucket: "reddit-clone-68c40.appspot.com",
  messagingSenderId: "951126470027",
  appId: "1:951126470027:web:356af8d63d41ebb2cbd38e",
};

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
export const storage = firebase.storage();
export default firebase