import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyABTNXniR-nrN4AHLbZcetgmLHH3zj-nK4",
  authDomain: "cloudproject-79c25.firebaseapp.com",
  projectId: "cloudproject-79c25",
  storageBucket: "cloudproject-79c25.appspot.com",
  messagingSenderId: "444074241099",
  appId: "1:444074241099:web:4b6fded673c74db0f1f1ce",
  measurementId: "G-7HYL49PMY7"
};

const firebaseapp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseapp);
const auth = getAuth(firebaseapp)

export { db, auth };