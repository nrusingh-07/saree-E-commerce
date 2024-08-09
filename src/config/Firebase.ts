// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBvyFKf5UjalwajR9TN2bc4F1tAP8iXyCk',
  authDomain: 'saree-ecommerce-freelance.firebaseapp.com',
  projectId: 'saree-ecommerce-freelance',
  storageBucket: 'saree-ecommerce-freelance.appspot.com',
  messagingSenderId: '73145498674',
  appId: '1:73145498674:web:571e05845e58d821c8d02b',
  measurementId: 'G-HNWV951YS9',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)

export { auth, storage }
