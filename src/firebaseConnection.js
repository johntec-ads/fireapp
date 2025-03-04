import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';//Import do BD do firebase
import { getAuth } from 'firebase/auth'           


/* import {initializeApp, } from 'firebase/app';
import {getFirestore} from 'firebase/firestore' */


const firebaseConfig = {
  apiKey: "AIzaSyCa49JQqoZuO8X0PQfEtSbfgfdC-D85y4I",
  authDomain: "fir-app-e2099.firebaseapp.com",
  projectId: "fir-app-e2099",
  storageBucket: "fir-app-e2099.appspot.com",
  messagingSenderId: "83176044307",
  appId: "1:83176044307:web:efa27e2d78c3bed5b70ce6",
  measurementId: "G-HZW9FJVWWX"
};
//A const firebaseApp obtém a configuração original do firebase
const firebaseApp = initializeApp(firebaseConfig);
//A const db obtém a cosnt firebaseApp
const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);

/* Como o export não tem default, o import dentro do arquivo,
 deve conter chaves. Exemple: import{db} from './firebaseConnection */
export { db, auth } ;