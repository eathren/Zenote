import { initializeApp } from "firebase/app"
import { initializeFirestore, memoryLocalCache } from "firebase/firestore"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import configValues from "./configValues.json"
import { getStorage } from "firebase/storage"

const app = initializeApp(configValues)
export const db = initializeFirestore(app, { localCache: memoryLocalCache() })

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)
