import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDaONss8a3-oO_TNQX-5YPzD12E4d1bWlI",
    authDomain: "mnelisi-todolist.firebaseapp.com",
    projectId: "mnelisi-todolist",
    storageBucket: "mnelisi-todolist.firebasestorage.app",
    messagingSenderId: "334133636005",
    appId: "1:334133636005:web:a5726c606d94c6f528164c"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc };
