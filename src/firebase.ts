// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNDKVMMQ7ZtkKcMIySxn8S6X8C0LjB5u8",
  authDomain: "chat-app-2c164.firebaseapp.com",
  projectId: "chat-app-2c164",
  storageBucket: "chat-app-2c164.appspot.com",
  messagingSenderId: "1036508792020",
  appId: "1:1036508792020:web:89e48276edbd3b5f692741",
  measurementId: "G-3Z31CJ8GSP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
