// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDPHfU4kAsjfePVBzX0QxALooac9udIr5o',
  authDomain: 'yavoy-53a3a.firebaseapp.com',
  projectId: 'yavoy-53a3a',
  storageBucket: 'yavoy-53a3a.firebasestorage.app',
  messagingSenderId: '850758035188',
  appId: '1:850758035188:web:444b89b27c0829a60260a1',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
