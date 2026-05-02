// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB6cvkooTkpba943Rkq97YNk8KkQ2y_WQA',
  authDomain: 'yavoy-f74c9.firebaseapp.com',
  projectId: 'yavoy-f74c9',
  storageBucket: 'yavoy-f74c9.firebasestorage.app',
  messagingSenderId: '602940649800',
  appId: '1:602940649800:web:6c2e6d1db38d2ab55e837d',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
