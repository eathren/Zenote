import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import configValues from "./configValues.json"

const app = initializeApp(configValues)
export const auth = getAuth(app)
export const firestore = getFirestore(app)

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_ID + ".firebaseapp.com",
//   projectId: import.meta.env.VITE_FIREBASE_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_ID + ".appspot.com",
//   messagingSenderId: "362817701306",
//   appId: import.meta.env.VITE_APP_ID,
// }
