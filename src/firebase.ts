// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCw_O-r4zITRdVsHlS1f6h2UT0kfYFoZrs",
    authDomain: "webdevproject322.firebaseapp.com",
    databaseURL: "https://webdevproject322-default-rtdb.firebaseio.com",
    projectId: "webdevproject322",
    storageBucket: "webdevproject322.appspot.com",
    messagingSenderId: "65749245086",
    appId: "1:65749245086:web:26b9a2c348ebfaf4c4af8f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {
    // Do nothing, user is signed in
  })
  .catch((error) => {
    console.error(error);
  });

export { db, auth };