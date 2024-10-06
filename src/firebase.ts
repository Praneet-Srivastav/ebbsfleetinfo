import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAY4IQ6vIx2xOYoiWbyKL3zlkc8HP-ByOQ",
  authDomain: "ebbsfleetinfo.firebaseapp.com",
  projectId: "ebbsfleetinfo",
  storageBucket: "gs://ebbsfleetinfo.appspot.com",
  messagingSenderId: "154546361845",
  appId: "1:154546361845:web:87b70917ef120e7fa53cbc"
}
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)